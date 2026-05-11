using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using yemeksiparismete.Server.Data;
using yemeksiparismete.Server.Models;
using yemeksiparismete.Server.Hubs;

namespace yemeksiparismete.Server.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<OrderHub> _hubContext;

        public OrdersController(AppDbContext context, IHubContext<OrderHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            // 1. Sadece UserId ile siparişleri çekiyoruz
            var orders = await _context.Orders
                .Include(o => o.Items)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            var result = new List<object>();

            foreach (var o in orders)
            {
                string rName = "Bilinmeyen Restoran";
                var firstItem = o.Items.FirstOrDefault();
                if (firstItem != null)
                {
                    var product = await _context.Products.FindAsync(firstItem.ProductId);
                    if (product != null)
                    {
                        var rest = await _context.Restaurants.FindAsync(product.RestaurantId);
                        if (rest != null) rName = rest.Name;
                    }
                }

                // Puanı bulalım (Eğer tablo henüz yoksa hata almamak için try-catch)
                int? score = null;
                try {
                    var rating = await _context.RestaurantRatings.FirstOrDefaultAsync(rr => rr.OrderId == o.Id);
                    score = rating?.Score;
                } catch { }

                result.Add(new {
                    o.Id,
                    o.UserId,
                    o.UserEmail,
                    o.CustomerName,
                    o.DeliveryAddress,
                    o.CustomerPhone,
                    o.TotalAmount,
                    o.CouponCode,
                    o.DiscountAmount,
                    o.Note,
                    o.PaymentMethod,
                    o.OrderDate,
                    o.Status,
                    o.Items,
                    RestaurantName = rName,
                    RatingScore = score
                });
            }

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine($"GetOrderById called for ID: {id}, User: {userId}");
            
            if (userId == null) return Unauthorized();

            var order = await _context.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound("Sipariş veritabanında bulunamadı.");
            
            if (order.UserId != userId) 
                return Unauthorized($"Bu sipariş size ait değil. (Sipariş Sahibi ID: {order.UserId}, Mevcut Kullanıcı ID: {userId})");

            // Restoran adını bulalım
            string rName = "Bilinmeyen Restoran";
            var firstItem = order.Items.FirstOrDefault();
            if (firstItem != null)
            {
                var product = await _context.Products.FindAsync(firstItem.ProductId);
                if (product != null)
                {
                    var rest = await _context.Restaurants.FindAsync(product.RestaurantId);
                    if (rest != null) rName = rest.Name;
                }
            }

            return Ok(new {
                order.Id,
                order.UserId,
                order.UserEmail,
                order.CustomerName,
                order.DeliveryAddress,
                order.CustomerPhone,
                order.TotalAmount,
                order.CouponCode,
                order.DiscountAmount,
                order.Note,
                order.PaymentMethod,
                order.OrderDate,
                order.Status,
                order.Items,
                RestaurantName = rName
            });
        }

        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);
            if (order == null) return NotFound("Sipariş bulunamadı.");

            if (order.Status != "preparing")
            {
                return BadRequest(new { message = "Sadece hazırlanma aşamasındaki siparişler iptal edilebilir. Yola çıkan veya teslim edilen siparişler için destek hattıyla görüşün." });
            }

            order.Status = "cancelled";
            await _context.SaveChangesAsync();

            // SignalR ile bildir
            await _hubContext.Clients.All.SendAsync("UpdateStatus", id, "cancelled");

            return Ok(new { message = "Siparişiniz başarıyla iptal edildi." });
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderRequestDto request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var currentUser = userId != null ? await _context.Users.FindAsync(userId) : null;
            
            // If not logged in, we can still allow guest orders, or assign a random ID
            if (userId == null) userId = "guest_" + Guid.NewGuid().ToString().Substring(0, 8);

            // KRİTİK: 300 TL Alt Limit Kontrolü (İndirim dahil son tutar)
            if (request.TotalAmount < 300)
            {
                return BadRequest(new { message = "Minimum sepet tutarı 300 TL olmalıdır. Lütfen sepetinize daha fazla ürün ekleyin." });
            }

            var newOrder = new Order
            {
                UserId = userId,
                UserEmail = currentUser?.Email ?? "", // E-posta kaydı
                CustomerName = request.CustomerName ?? currentUser?.FullName ?? "Misafir",
                CustomerPhone = (request.CustomerPhone == null || request.CustomerPhone == "-") 
                                ? (currentUser?.PhoneNumber ?? "-") 
                                : request.CustomerPhone,
                DeliveryAddress = request.DeliveryAddress ?? "-",
                TotalAmount = request.TotalAmount,
                CouponCode = request.CouponCode,
                DiscountAmount = request.DiscountAmount,
                Note = request.Note,
                PaymentMethod = request.PaymentMethod ?? "cash_at_door",
                OrderDate = DateTime.Now,
                RestaurantId = request.RestaurantId,
                Status = "preparing",
                Items = request.Items.Select(i => new OrderItem
                {
                    ProductId = i.ProductId,
                    ProductName = i.ProductName,
                    Quantity = i.Quantity,
                    Price = i.Price
                }).ToList()
            };

            try 
            {
                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync();

                // SinyalR üzerinden canlı admin paneline bildir
                await _hubContext.Clients.All.SendAsync("ReceiveNewOrder", new {
                    newOrder.Id,
                    newOrder.CustomerName,
                    newOrder.TotalAmount,
                    newOrder.DeliveryAddress,
                    Status = "preparing",
                    newOrder.OrderDate
                });

                return Ok(new { newOrder.Id });
            } 
            catch (Exception ex) 
            {
                return StatusCode(500, new { error = ex.Message, inner = ex.InnerException?.Message });
            }
        }

        [HttpPatch("update-status/{id}/{status}")]
        [Authorize(Roles = "admin,restaurant_owner")]
        public async Task<IActionResult> UpdateStatus(int id, string status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.Status = status;
            await _context.SaveChangesAsync();

            // SignalR ile web paneline de bildir
            await _hubContext.Clients.All.SendAsync("OrderStatusUpdated", new { id, status });

            return Ok(new { success = true });
        }
    }

    public class OrderRequestDto
    {
        public decimal TotalAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public string? CouponCode { get; set; }
        public int? RestaurantId { get; set; }
        public string? PaymentMethod { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerPhone { get; set; }
        public string? DeliveryAddress { get; set; }
        public string? Note { get; set; }
        public List<OrderItemRequestDto> Items { get; set; } = new();
    }

    public class OrderItemRequestDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
