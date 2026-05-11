using System;

namespace yemeksiparismete.Server.Models
{
    public class SupportMessage
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Open"; // Open, Pending, Closed
    }
}
