using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using yemeksiparismete.Server.Data;
using yemeksiparismete.Server.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace yemeksiparismete.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SupportController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SupportController(AppDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpPost("chat")]
        public async Task<IActionResult> ProcessChatMessage([FromBody] ChatRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            var lastOrder = await _context.Orders
                .Include(o => o.Items)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .FirstOrDefaultAsync();
            
            ChatSession? session;
            if (request.SessionId > 0)
            {
                session = await _context.ChatSessions.FirstOrDefaultAsync(s => s.Id == request.SessionId);
            }
            else
            {
                session = new ChatSession { UserId = userId, CreatedAt = DateTime.UtcNow };
                _context.ChatSessions.Add(session);
                await _context.SaveChangesAsync();
            }

            var userMsg = new ChatMessage { ChatSessionId = session!.Id, Sender = "User", Content = request.Message, Timestamp = DateTime.UtcNow };
            _context.ChatMessages.Add(userMsg);

            AIResult aiResult = GetInternalAIResponse(request.Message, user?.FullName ?? "Değerli Müşterimiz", lastOrder);
            
            var aiMsg = new ChatMessage {
                ChatSessionId = session.Id,
                Sender = "AI",
                Content = aiResult.Text,
                Timestamp = DateTime.UtcNow
            };
            _context.ChatMessages.Add(aiMsg);
            await _context.SaveChangesAsync();

            return Ok(new { sessionId = session.Id, response = aiResult.Text, options = aiResult.Options });
        }

        private AIResult GetInternalAIResponse(string input, string userName, Order? lastOrder)
        {
            input = input.ToLower();
            
            if (input.Contains("merhaba") || input.Contains("selam") || input.Contains("başlat"))
            {
                return new AIResult { 
                    Text = $"👋 **Selam {userName}!** Ben Mete AI. Sana yardımcı olmak için buradayım. Hiçbir yere gitmene gerek yok, aşağıdaki butonlarla her şeyi çözebiliriz. Ne yapalım?", 
                    Options = new List<string> { "Sipariş Takibi", "İptal İşlemleri", "Ödeme Sorunları", "Hizmetlerimiz" } 
                };
            }

            if (input.Contains("takip") || input.Contains("nerede") || input.Contains("sipariş takibi"))
            {
                if (lastOrder != null)
                {
                    var items = string.Join(", ", lastOrder.Items.Select(i => i.Quantity + "x " + i.ProductName));
                    return new AIResult { 
                        Text = $"📦 **Siparişin Yolda!**\n\n#{lastOrder.Id} nolu siparişin (**{items}**) şu an **{lastOrder.Status}** durumunda. Kuryemiz en kısa sürede kapında olacak.\n\n👉 [Siparişlerimi Görüntüle](/profile?tab=orders)",
                        Options = new List<string> { "Siparişlerim", "Restorana Soru Sor", "Ana Sayfa" }
                    };
                }
                return new AIResult { 
                    Text = "📦 Şu an aktif bir siparişin görünmüyor. Yeni bir sipariş vermek ister misin?", 
                    Options = new List<string> { "Yemek Sipariş Et", "Eski Siparişlerim", "Ana Sayfa" } 
                };
            }
            
            if (input.Contains("iptal"))
            {
                if (lastOrder != null && lastOrder.Status == "Onay Bekliyor")
                {
                    return new AIResult { 
                        Text = $"🚫 **İptal Edilebilir:** #{lastOrder.Id} nolu siparişin henüz hazırlanmaya başlanmamış. \n\n👉 [Siparişi İptal Etmek İçin Tıkla](/profile?tab=orders)",
                        Options = new List<string> { "Siparişlerim", "Vazgeç" }
                    };
                }
                return new AIResult { 
                    Text = "🚫 **İptal Koşulu:** Siparişin eğer 'Hazırlanıyor' veya 'Yolda' ise sistem üzerinden iptal edilemez.\n\n📞 Destek: 444 0 000",
                    Options = new List<string> { "Siparişlerim", "Canlı Temsilci", "Vazgeç" }
                };
            }
            
            if (input.Contains("ödeme"))
            {
                return new AIResult { 
                    Text = "💳 **Ödeme İşlemleri:** Ödemenle ilgili bir sorun yaşıyorsan kart bilgilerini güncelleyebilirsin.\n\n👉 [Ödeme Yöntemlerim](/profile?tab=payments)",
                    Options = new List<string> { "Ödeme Yöntemlerini Düzenle", "Para İadesi Talebi", "Canlı Destek" }
                };
            }

            if (input.Contains("hizmet"))
            {
                return new AIResult { 
                    Text = "🚀 **YemekMete Hakkında:** Türkiye'nin en hızlı yemek sipariş platformuyuz. Sana sıcak yemek, hızlı teslimat ve 7/24 destek garantisi veriyoruz!",
                    Options = new List<string> { "Şikayet Oluştur", "Öneri Gönder", "Ana Sayfa" }
                };
            }

            return new AIResult { 
                Text = "🤖 Anladım. Sana en iyi şu konularda yardımcı olabilirim. Lütfen birini seç:", 
                Options = new List<string> { "Sipariş Takibi", "İptal İşlemleri", "Ödeme Sorunları", "Ana Sayfa" } 
            };
        }
    }

    public class AIResult {
        public string Text { get; set; } = string.Empty;
        public List<string> Options { get; set; } = new List<string>();
    }

    public class ChatRequest {
        public int SessionId { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
