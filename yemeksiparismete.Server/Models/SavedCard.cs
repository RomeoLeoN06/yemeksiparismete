namespace yemeksiparismete.Server.Models
{
    public class SavedCard
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string CardHolderName { get; set; } = string.Empty;
        public string MaskedCardNumber { get; set; } = string.Empty; // e.g., **** **** **** 1234
        public string ExpiryDate { get; set; } = string.Empty; // MM/YY
    }
}
