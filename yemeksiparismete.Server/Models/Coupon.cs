using System;

namespace yemeksiparismete.Server.Models
{
    public class Coupon
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public decimal DiscountAmount { get; set; } // TL bazlı indirim
        public decimal MinimumOrderAmount { get; set; } = 300; // Kuponun geçerli olması için gereken min tutar
        public bool IsActive { get; set; } = true;
        public DateTime ExpiryDate { get; set; } = DateTime.Now.AddDays(30);
    }
}
