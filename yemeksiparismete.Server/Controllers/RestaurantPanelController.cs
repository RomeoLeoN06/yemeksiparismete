using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using yemeksiparismete.Server.Data;
using yemeksiparismete.Server.Models;
using Microsoft.AspNetCore.SignalR;
using yemeksiparismete.Server.Hubs;

namespace yemeksiparismete.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "restaurant_owner")]
    public class RestaurantPanelController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<OrderHub> _hubContext;

        public RestaurantPanelController(AppDbContext context, IHubContext<OrderHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        private string? GetUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        [HttpGet("my-restaurant")]
        public async Task<IActionResult> GetMyRestaurant()
        {
            var userId = GetUserId();
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.OwnerId == userId);
            
            if (restaurant == null) return NotFound("Restoranınız bulunamadı.");
            return Ok(restaurant);
        }

        [HttpPut("my-restaurant")]
        public async Task<IActionResult> UpdateMyRestaurant([FromBody] Restaurant updateDto)
        {
            var userId = GetUserId();
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.OwnerId == userId);
            
            if (restaurant == null) return NotFound();

            restaurant.Name = updateDto.Name;
            restaurant.Address = updateDto.Address;
            restaurant.Description = updateDto.Description;
            restaurant.LogoUrl = updateDto.LogoUrl;
            restaurant.BannerUrl = updateDto.BannerUrl;
            
            await _context.SaveChangesAsync();
            return Ok(restaurant);
        }

        [HttpGet("my-products")]
        public async Task<IActionResult> GetMyProducts()
        {
            var userId = GetUserId();
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.OwnerId == userId);
            if (restaurant == null) return NotFound();

            var products = await _context.Products.Where(p => p.RestaurantId == restaurant.Id).ToListAsync();
            return Ok(products);
        }

        [HttpPost("my-products")]
        public async Task<IActionResult> AddProduct([FromBody] Product product)
        {
            var userId = GetUserId();
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.OwnerId == userId);
            if (restaurant == null) return NotFound();

            product.RestaurantId = restaurant.Id;
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok(product);
        }

        [HttpPut("my-products/{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product updateDto)
        {
            var userId = GetUserId();
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.OwnerId == userId);
            if (restaurant == null) return NotFound();

            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id && p.RestaurantId == restaurant.Id);
            if (product == null) return NotFound();

            product.Name = updateDto.Name;
            product.Price = updateDto.Price;
            product.Description = updateDto.Description;
            product.ImageUrl = updateDto.ImageUrl;
            product.Category = updateDto.Category;
            product.Stock = updateDto.Stock;

            await _context.SaveChangesAsync();
            return Ok(product);
        }

        [HttpDelete("my-products/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var userId = GetUserId();
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.OwnerId == userId);
            if (restaurant == null) return NotFound();

            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id && p.RestaurantId == restaurant.Id);
            if (product == null) return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Ürün silindi." });
        }

        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = GetUserId();
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.OwnerId == userId);
            if (restaurant == null) return NotFound();

            var orders = await _context.Orders
                .Include(o => o.Items)
                .Where(o => o.RestaurantId == restaurant.Id)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return Ok(orders);
        }

        [HttpPatch("my-orders/{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromQuery] string status)
        {
            var userId = GetUserId();
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.OwnerId == userId);
            if (restaurant == null) return NotFound(new { success = false, message = "Restoran bulunamadı." });

            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id && o.RestaurantId == restaurant.Id);
            if (order == null) return NotFound(new { success = false, message = "Sipariş bulunamadı veya bu restorana ait değil." });

            order.Status = status.Trim().ToLower();
            _context.Entry(order).State = EntityState.Modified;
            
            try 
            {
                await _context.SaveChangesAsync();
                await _hubContext.Clients.All.SendAsync("UpdateStatus", id, order.Status);
                await _hubContext.Clients.All.SendAsync("OrderStatusUpdated", new { id, status = order.Status });
                return Ok(new { success = true, message = "Durum başarıyla güncellendi.", order });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Hata: {ex.Message}" });
            }
        }
    }
}
