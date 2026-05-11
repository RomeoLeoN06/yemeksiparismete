using System.ComponentModel.DataAnnotations;

namespace yemeksiparismete.Server.Models
{
    public class RestaurantRating
    {
        public int Id { get; set; }
        
        [Required]
        public int RestaurantId { get; set; }
        
        [Required]
        public string UserId { get; set; } = string.Empty;
        
        [Required]
        public int OrderId { get; set; }
        
        [Range(1, 5)]
        public int Score { get; set; } // 1-5 arası yıldız
        
        public string? Comment { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
