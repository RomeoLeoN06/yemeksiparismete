using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using yemeksiparismete.Server.Data;
using yemeksiparismete.Server.Models;
using System.Security.Claims;

namespace yemeksiparismete.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CourierController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public CourierController(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var userId = _userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null || user.Role != "courier") return Forbid();

            var orders = await _context.Orders
                .Where(o => o.CourierId == userId)
                .ToListAsync();

            var deliveredOrders = orders.Where(o => o.Status == "delivered").ToList();
            
            // Örnek Kazanç Hesaplama: Sabit 20 TL + Sipariş Tutarının %5'i
            decimal totalEarnings = deliveredOrders.Count * 20 + deliveredOrders.Sum(o => o.TotalAmount * 0.05m);
            decimal todayEarnings = deliveredOrders
                .Where(o => o.OrderDate.Date == DateTime.Today)
                .Sum(o => 20 + (o.TotalAmount * 0.05m));

            return Ok(new
            {
                totalOrders = orders.Count,
                deliveredCount = deliveredOrders.Count,
                cancelledCount = orders.Count(o => o.Status == "cancelled"),
                totalEarnings,
                todayEarnings,
                iban = user.IBAN,
                isActive = user.IsCourierActive
            });
        }

        [HttpGet("my-orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = _userManager.GetUserId(User);
            var orders = await _context.Orders
                .Where(o => o.CourierId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return Ok(orders);
        }

        [HttpPut("update-order-status/{orderId}")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] string status)
        {
            var userId = _userManager.GetUserId(User);
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == orderId && o.CourierId == userId);
            
            if (order == null) return NotFound("Sipariş bulunamadı veya size ait değil.");

            order.Status = status;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = $"Sipariş durumu '{status}' olarak güncellendi." });
        }

        [HttpPost("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] CourierProfileUpdate model)
        {
            var userId = _userManager.GetUserId(User);
            var user = await _userManager.FindByIdAsync(userId!);
            if (user == null) return NotFound();

            user.IBAN = model.IBAN;
            user.IsCourierActive = model.IsActive;

            await _userManager.UpdateAsync(user);
            return Ok(new { success = true, message = "Profil başarıyla güncellendi." });
        }

        // Mevcut başvuru metodlarını koruyalım (Admin için)
        [AllowAnonymous]
        [HttpPost("apply")]
        public async Task<IActionResult> Apply([FromBody] CourierApplication application)
        {
            application.ApplicationDate = DateTime.UtcNow;
            application.Status = "Pending";
            _context.CourierApplications.Add(application);
            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }

        [HttpGet("applications")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetApplications()
        {
            var apps = await _context.CourierApplications.OrderByDescending(a => a.ApplicationDate).ToListAsync();
            return Ok(apps);
        }
    }

    public class CourierProfileUpdate
    {
        public string? IBAN { get; set; }
        public bool IsActive { get; set; }
    }
}
