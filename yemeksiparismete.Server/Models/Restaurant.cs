namespace yemeksiparismete.Server.Models
{
    public class Restaurant
    {
        public int Id { get; set; }
        
        // Restoranın sahibi olan kullanıcının ID'si (İlişkisel Veritabanı mantığı)
        public string? OwnerId { get; set; } 
        public string? Logo { get; set; } // Compatibility with frontend mock data        
        public string Name { get; set; } = string.Empty;
        
        public string LogoUrl { get; set; } = string.Empty;
        public string BannerUrl { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        
        public string Address { get; set; } = string.Empty;
        
        public string Description { get; set; } = string.Empty;

        public int DistrictId { get; set; }
        
        public double Rating { get; set; } = 4.5;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}