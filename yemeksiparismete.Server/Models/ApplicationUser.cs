using Microsoft.AspNetCore.Identity;

namespace yemeksiparismete.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = "customer"; // admin, restaurant_owner, customer, courier
        public string? IBAN { get; set; }
        public bool IsCourierActive { get; set; } = false;
        public string? RecoveryCode { get; set; } // Şifre sıfırlama için yedek kod
        public string? ProfileImageBase64 { get; set; } // Profil fotoğrafı (Base64)
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
