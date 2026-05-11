using System.ComponentModel.DataAnnotations;

namespace yemeksiparismete.Server.Models
{
    public class CourierApplication
    {
        [Key]
        public int Id { get; set; }
        
        [Required, MaxLength(100)]
        public string FullName { get; set; } = string.Empty;
        
        [Required, MaxLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;
        
        [Required, MaxLength(100)]
        public string Email { get; set; } = string.Empty;
        
        [MaxLength(50)]
        public string VehicleType { get; set; } = string.Empty; // Motosiklet, Bisiklet, Otomobil
        
        [MaxLength(20)]
        public string DriverLicenseType { get; set; } = string.Empty; // A1, A2, B, Ehliyetim Yok
        
        [MaxLength(50)]
        public string City { get; set; } = string.Empty;
        
        [MaxLength(50)]
        public string District { get; set; } = string.Empty;
        
        [MaxLength(1000)]
        public string ExperienceInfo { get; set; } = string.Empty;
        
        public DateTime ApplicationDate { get; set; } = DateTime.UtcNow;
        
        [MaxLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
    }
}
