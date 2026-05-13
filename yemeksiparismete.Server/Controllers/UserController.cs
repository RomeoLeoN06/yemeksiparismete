using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using yemeksiparismete.Server.Data;
using yemeksiparismete.Server.Models;

namespace yemeksiparismete.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AppDbContext _context;

        public UserController(UserManager<ApplicationUser> userManager, AppDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound();

            var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
            if (result.Succeeded)
            {
                return Ok(new { message = "Şifre başarıyla güncellendi." });
            }

            return BadRequest(result.Errors);
        }

        [HttpGet("addresses")]
        public async Task<IActionResult> GetAddresses()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var addresses = await _context.UserAddresses
                .Include(a => a.City)
                .Include(a => a.District)
                .Where(a => a.UserId == userId)
                .ToListAsync();

            return Ok(addresses);
        }

        [HttpPost("addresses")]
        public async Task<IActionResult> AddAddress([FromBody] UserAddress address)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            address.UserId = userId;
            _context.UserAddresses.Add(address);
            await _context.SaveChangesAsync();

            return Ok(address);
        }

        [HttpDelete("addresses/{id}")]
        public async Task<IActionResult> DeleteAddress(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var address = await _context.UserAddresses.FindAsync(id);
            
            if (address == null || address.UserId != userId) return NotFound();

            _context.UserAddresses.Remove(address);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Adres silindi." });
        }

        [HttpGet("payment-methods")]
        public async Task<IActionResult> GetPaymentMethods()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var methods = await _context.SavedCards
                .Where(c => c.UserId == userId)
                .ToListAsync();

            return Ok(methods);
        }

        [HttpPost("payment-methods")]
        public async Task<IActionResult> AddPaymentMethod([FromBody] SavedCard card)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            card.UserId = userId;
            
            if (card.MaskedCardNumber.Length >= 4 && !card.MaskedCardNumber.Contains("*"))
            {
                var last4 = card.MaskedCardNumber.Substring(card.MaskedCardNumber.Length - 4);
                card.MaskedCardNumber = $"**** **** **** {last4}";
            }

            _context.SavedCards.Add(card);
            await _context.SaveChangesAsync();

            return Ok(card);
        }

        [HttpDelete("payment-methods/{id}")]
        public async Task<IActionResult> DeletePaymentMethod(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var card = await _context.SavedCards.FindAsync(id);
            
            if (card == null || card.UserId != userId) return NotFound();

            _context.SavedCards.Remove(card);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Ödeme yöntemi silindi." });
        }

        [HttpGet("profile-image")]
        public async Task<IActionResult> GetProfileImage()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound();

            return Ok(new { imageBase64 = user.ProfileImageBase64 });
        }

        [HttpPost("profile-image")]
        public async Task<IActionResult> UploadProfileImage([FromBody] ProfileImageDto model)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound();

            user.ProfileImageBase64 = model.ImageBase64;
            await _userManager.UpdateAsync(user);

            return Ok(new { message = "Profil fotoğrafı başarıyla güncellendi." });
        }

        [HttpPost("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto model)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound();

            if (!string.IsNullOrEmpty(model.FullName)) user.FullName = model.FullName;
            if (!string.IsNullOrEmpty(model.PhoneNumber)) {
                // Normalize phone
                var normalizedPhone = new string(model.PhoneNumber.Where(char.IsDigit).ToArray());
                if (normalizedPhone.StartsWith("0")) normalizedPhone = normalizedPhone.Substring(1);
                user.PhoneNumber = normalizedPhone;
            }

            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                return Ok(new { 
                    message = "Profil başarıyla güncellendi.",
                    user = new { user.Id, user.FullName, user.Email, user.PhoneNumber, user.Role }
                });
            }

            return BadRequest(result.Errors);
        }
        [AllowAnonymous]
        [HttpGet("leaderboard")]
        public async Task<IActionResult> GetLeaderboard()
        {
            // SSMS'teki sorgunun aynısını doğrudan SQL olarak çalıştırıyoruz
            var topUsers = await _context.Users
                .FromSqlRaw("SELECT TOP 10 * FROM AspNetUsers ORDER BY GreenPoints DESC")
                .Select(u => new {
                    u.FullName,
                    u.GreenPoints,
                    u.ProfileImageBase64
                })
                .ToListAsync();

            return Ok(topUsers);
        }

        [HttpGet("member-address/{userId}")]
        public async Task<IActionResult> GetMemberPrimaryAddress(string userId)
        {
            var address = await _context.UserAddresses
                .Include(a => a.City)
                .Include(a => a.District)
                .FirstOrDefaultAsync(a => a.UserId == userId);

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound();

            return Ok(new { 
                fullName = user.FullName,
                phoneNumber = user.PhoneNumber,
                address = address != null ? $"{address.Title}: {address.Neighborhood} Mah. {address.Street} Sok. No:{address.BuildingNo} {address.District?.Name}/{address.City?.Name}" : ""
            });
        }
    }

    public class UpdateProfileDto
    {
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
    }

    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    public class ProfileImageDto
    {
        public string ImageBase64 { get; set; } = string.Empty;
    }
}
