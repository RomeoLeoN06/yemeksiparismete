using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using yemeksiparismete.Server.Data;
using yemeksiparismete.Server.Models;

namespace yemeksiparismete.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;

        public AuthController(UserManager<ApplicationUser> userManager, IConfiguration configuration, AppDbContext context)
        {
            _userManager = userManager;
            _configuration = configuration;
            _context = context;
        }

        [HttpGet("me")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = _userManager.GetUserId(User);
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound();

            return Ok(new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.PhoneNumber,
                user.Role,
                user.RecoveryCode
            });
        }

        [HttpGet("test-db")]
        public async Task<IActionResult> TestDb()
        {
            var userCount = await _userManager.Users.CountAsync();
            var roles = await _context.Roles.ToListAsync();
            var admins = await _userManager.GetUsersInRoleAsync("admin");
            
            return Ok(new { 
                userCount, 
                roles = roles.Select(r => r.Name),
                adminCount = admins.Count,
                dbPath = _context.Database.GetDbConnection().ConnectionString
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            // Normalize phone number (keep only digits)
            var normalizedPhone = new string(model.PhoneNumber.Where(char.IsDigit).ToArray());
            if (normalizedPhone.StartsWith("0")) normalizedPhone = normalizedPhone.Substring(1); // Remove leading zero for consistency

            // Check if email already exists
            var existingUserByEmail = await _userManager.FindByEmailAsync(model.Email);
            if (existingUserByEmail != null)
            {
                return BadRequest(new[] { new { code = "DuplicateEmail", description = "Bu e-posta adresi zaten kullanımda." } });
            }

            // Check if phone number already exists (compare normalized numbers)
            var allUsers = await _userManager.Users.ToListAsync();
            var existingUserByPhone = allUsers.FirstOrDefault(u => {
                if (string.IsNullOrEmpty(u.PhoneNumber)) return false;
                var dbPhone = new string(u.PhoneNumber.Where(char.IsDigit).ToArray());
                if (dbPhone.StartsWith("0")) dbPhone = dbPhone.Substring(1);
                return dbPhone == normalizedPhone;
            });

            if (existingUserByPhone != null)
            {
                return BadRequest(new[] { new { code = "DuplicatePhone", description = "Bu telefon numarası zaten kullanımda." } });
            }

            var user = new ApplicationUser 
            { 
                UserName = model.Email, 
                Email = model.Email, 
                PhoneNumber = normalizedPhone, // Save normalized version
                FullName = model.FullName, 
                Role = model.Role,
                RecoveryCode = Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper()
            };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, model.Role);
                return Ok(new { message = "Registration successful", recoveryCode = user.RecoveryCode });
            }

            return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            // 1. Try finding by Email first
            var user = await _userManager.FindByEmailAsync(model.Identifier);
            
            // 2. If not found by email, try finding by normalized PhoneNumber
            if (user == null)
            {
                var normalizedId = new string(model.Identifier.Where(char.IsDigit).ToArray());
                if (normalizedId.StartsWith("0")) normalizedId = normalizedId.Substring(1);

                if (!string.IsNullOrEmpty(normalizedId))
                {
                    user = await _userManager.Users.FirstOrDefaultAsync(u => u.PhoneNumber == normalizedId);
                }
            }

            if (user != null)
            {
                bool isPasswordCorrect = await _userManager.CheckPasswordAsync(user, model.Password);
                
                // Eğer standart şifreleme başarısızsa ama DB'deki Hash doğrudan şifrenin kendisiyse (Manuel SQL müdahalesi durumu)
                if (!isPasswordCorrect && user.PasswordHash == model.Password)
                {
                    // Şifreyi hemen düzgün şekilde hashleyip güncelle (Otomatik Onarma)
                    var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
                    var resetResult = await _userManager.ResetPasswordAsync(user, resetToken, model.Password);
                    
                    if (resetResult.Succeeded)
                    {
                        isPasswordCorrect = true; // Artık giriş yapabilir
                    }
                }

                if (isPasswordCorrect)
                {
                    var token = GenerateJwtToken(user);
                    return Ok(new
                    {
                        token,
                        user = new { user.Id, user.FullName, user.Email, user.PhoneNumber, user.Role, user.RecoveryCode }
                    });
                }
            }

            return Unauthorized(new { message = "E-posta/Telefon veya şifre hatalı." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) return NotFound("Kullanıcı bulunamadı.");

            if (user.RecoveryCode != model.RecoveryCode?.ToUpper())
            {
                return BadRequest("Geçersiz kurtarma kodu.");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, model.NewPassword);

            if (result.Succeeded)
            {
                // Kod kullanıldıktan sonra yenisini üretelim (isteğe bağlı)
                user.RecoveryCode = Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper();
                await _userManager.UpdateAsync(user);
                
                return Ok(new { message = "Şifre başarıyla güncellendi.", newRecoveryCode = user.RecoveryCode });
            }

            return BadRequest(result.Errors);
        }

        [HttpGet("force-reset")]
        public async Task<IActionResult> ForceReset(string email, string newPassword)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return NotFound("Kullanıcı bulunamadı.");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, newPassword);

            if (result.Succeeded)
            {
                return Ok(new { message = $"{email} kullanıcısının şifresi başarıyla '{newPassword}' olarak güncellendi." });
            }

            return BadRequest(result.Errors);
        }

        private string GenerateJwtToken(ApplicationUser user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = Encoding.ASCII.GetBytes(jwtSettings.GetValue<string>("Key") ?? "yemeksiparismete_very_secret_key_1234567890");

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Email, user.Email!),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }

    public class RegisterDto { public string FullName { get; set; } = ""; public string Email { get; set; } = ""; public string PhoneNumber { get; set; } = ""; public string Password { get; set; } = ""; public string Role { get; set; } = "customer"; }
    public class LoginDto { public string Identifier { get; set; } = ""; public string Password { get; set; } = ""; }
    public class ResetPasswordDto { public string Email { get; set; } = ""; public string RecoveryCode { get; set; } = ""; public string NewPassword { get; set; } = ""; }
}
