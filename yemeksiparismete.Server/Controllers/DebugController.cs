using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using yemeksiparismete.Server.Data;
using yemeksiparismete.Server.Models;

namespace yemeksiparismete.Server.Controllers
{
    [ApiController]
    [Route("api/debug")]
    public class DebugController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public DebugController(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("fix-orders")]
        public async Task<IActionResult> FixOrders()
        {
            // 1. 05555555555 numaralı kullanıcıyı bul
            var targetUser = await _context.Users.FirstOrDefaultAsync(u => u.PhoneNumber == "05555555555");
            if (targetUser == null) return NotFound("Bu numaralı kullanıcı bulunamadı.");

            // 2. Mevcut tüm siparişleri (veya belirli birini) bu kullanıcıya ata
            var orders = await _context.Orders.ToListAsync();
            foreach (var order in orders)
            {
                order.UserId = targetUser.Id;
            }

            await _context.SaveChangesAsync();
            return Ok($"Başarılı! {orders.Count} adet sipariş {targetUser.FullName} kullanıcısına bağlandı.");
        }
        [HttpGet("fix-db")]
        public async Task<IActionResult> FixDatabase()
        {
            try
            {
                await _context.Database.ExecuteSqlRawAsync("ALTER TABLE [dbo].[Orders] ADD [RestaurantId] int NULL;");
                return Ok("Veritabanına RestaurantId sütunu başarıyla eklendi! Artık migration'a gerek yok.");
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("already has a"))
                {
                    return Ok("Sütun zaten eklenmiş.");
                }
                return BadRequest("Hata: " + ex.Message);
            }
        }

        [HttpGet("reset-passwords")]
        public async Task<IActionResult> ResetRestaurantPasswords()
        {
            var restaurantOwners = await _userManager.GetUsersInRoleAsync("restaurant_owner");
            int successCount = 0;

            foreach (var user in restaurantOwners)
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var result = await _userManager.ResetPasswordAsync(user, token, "Deneme123!");
                if (result.Succeeded)
                {
                    successCount++;
                }
            }

            return Ok($"Başarılı! {successCount} restoran hesabının şifresi 'Deneme123!' olarak güncellendi.");
        }
    }
}
