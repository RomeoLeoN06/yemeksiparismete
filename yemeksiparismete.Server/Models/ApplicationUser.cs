using Microsoft.AspNetCore.Identity;

namespace yemeksiparismete.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = "customer"; // admin, restaurant_owner, customer
        public string? RecoveryCode { get; set; } // Şifre sıfırlama için yedek kod
        public string? ProfileImageBase64 { get; set; } // Profil fotoğrafı (Base64)
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
