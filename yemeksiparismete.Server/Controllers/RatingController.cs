using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using yemeksiparismete.Server.Data;
using yemeksiparismete.Server.Models;

namespace yemeksiparismete.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class RatingController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RatingController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("submit")]
        public async Task<IActionResult> SubmitRating([FromBody] RatingRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            // 1. Siparişin bu kullanıcıya ait olup olmadığını kontrol et
            var order = await _context.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == request.OrderId);

            if (order == null) return NotFound("Sipariş bulunamadı.");
            
            // Güvenlik kontrolü: Sipariş bu kullanıcıya mı ait? (UserId veya Email eşleşmesi)
            var user = await _context.Users.FindAsync(userId);
            if (order.UserId != userId && order.UserEmail != user?.Email && order.CustomerPhone != user?.PhoneNumber)
            {
                return Forbid("Bu siparişi puanlama yetkiniz yok.");
            }

            // 2. Daha önce puan verilmiş mi kontrol et
            var existingRating = await _context.RestaurantRatings
                .FirstOrDefaultAsync(r => r.OrderId == request.OrderId);
            
            if (existingRating != null) return BadRequest("Bu siparişe daha önce puan verilmiş.");

            // 3. Siparişteki ilk ürünün restoranını bul (Basitlik için siparişin tek restorandan olduğu varsayılır)
            var firstItem = order.Items.FirstOrDefault();
            if (firstItem == null) return BadRequest("Sipariş içeriği boş.");

            var product = await _context.Products.FindAsync(firstItem.ProductId);
            if (product == null) return BadRequest("Ürün bulunamadı.");

            var restaurantId = product.RestaurantId;

            // 4. Yeni puanı kaydet
            var newRating = new RestaurantRating
            {
                RestaurantId = restaurantId,
                UserId = userId,
                OrderId = request.OrderId,
                Score = request.Score,
                Comment = request.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.RestaurantRatings.Add(newRating);
            await _context.SaveChangesAsync();

            // 5. Restoranın genel puanını güncelle (Ağırlıklı ortalama)
            await UpdateRestaurantAverageRating(restaurantId);

            return Ok(new { success = true, message = "Puanınız başarıyla kaydedildi." });
        }

        private async Task UpdateRestaurantAverageRating(int restaurantId)
        {
            var restaurant = await _context.Restaurants.FindAsync(restaurantId);
            if (restaurant != null)
            {
                var ratings = await _context.RestaurantRatings
                    .Where(r => r.RestaurantId == restaurantId)
                    .Select(r => r.Score)
                    .ToListAsync();

                if (ratings.Any())
                {
                    restaurant.Rating = Math.Round(ratings.Average(), 1);
                    await _context.SaveChangesAsync();
                }
            }
        }
    }

    public class RatingRequest
    {
        public int OrderId { get; set; }
        public int Score { get; set; }
        public string? Comment { get; set; }
    }
}
