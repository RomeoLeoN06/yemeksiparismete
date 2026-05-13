namespace yemeksiparismete.Server.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty; // E-posta ile takip için
        public string CustomerName { get; set; } = string.Empty;
        public string DeliveryAddress { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string PaymentMethod { get; set; } = "cash_at_door";
        public DateTime OrderDate { get; set; } = DateTime.Now;

        public int? RestaurantId { get; set; } // Siparişin hangi restorana ait olduğunu belirtmek için

        public string Status { get; set; } = "preparing";
        public string? CouponCode { get; set; }
        public decimal DiscountAmount { get; set; } = 0;
        public string? Note { get; set; }
        public string? CourierId { get; set; }
        public string? CourierName { get; set; }
        public bool IsEcoFriendly { get; set; } = false; // Plastik çatal-bıçak istememe vb.
        public double CarbonSaved { get; set; } = 0; // Tasarruf edilen karbon (gram)
        public int? GroupOrderSessionId { get; set; }
        public string? PayerUserId { get; set; } // Ödemeyi yapan kişi (Ismarlama senaryosu için)
        public GroupOrderSession? GroupOrderSession { get; set; }
        public List<OrderItem> Items { get; set; } = new List<OrderItem>();
    }

    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; } // İlişki için gerekli
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string? AddedByUserName { get; set; } // Grup siparişinde kimin eklediği
    }
}
