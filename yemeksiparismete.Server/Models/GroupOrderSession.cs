using System.ComponentModel.DataAnnotations;

namespace yemeksiparismete.Server.Models
{
    public class GroupOrderSession
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(6)]
        public string GroupCode { get; set; } = string.Empty; // Örn: 123456
        
        public int RestaurantId { get; set; }
        public string CreatorId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;

        public List<GroupOrderItem> Items { get; set; } = new List<GroupOrderItem>();
    }

    public class GroupOrderItem
    {
        public int Id { get; set; }
        public int GroupOrderSessionId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string AddedByUserId { get; set; } = string.Empty;
        public string AddedByUserName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
