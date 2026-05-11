using System;
using System.Collections.Generic;

namespace yemeksiparismete.Server.Models
{
    public class ChatSession
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public string? GuestSessionId { get; set; } // For non-logged in users
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public List<ChatMessage> Messages { get; set; } = new List<ChatMessage>();
        public bool IsClosed { get; set; } = false;
    }

    public class ChatMessage
    {
        public int Id { get; set; }
        public int ChatSessionId { get; set; }
        public string Sender { get; set; } = string.Empty; // "User" or "AI"
        public string Content { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
