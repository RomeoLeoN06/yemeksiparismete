using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using yemeksiparismete.Server.Data;
using yemeksiparismete.Server.Models;

namespace yemeksiparismete.Server.Hubs
{
    public class GroupOrderHub : Hub
    {
        private readonly AppDbContext _context;

        public GroupOrderHub(AppDbContext context)
        {
            _context = context;
        }

        // Grup oluşturma (6 haneli kod üretir)
        public async Task CreateGroup(int restaurantId, string userId)
        {
            var random = new Random();
            string groupCode = random.Next(100000, 999999).ToString();

            var session = new GroupOrderSession
            {
                GroupCode = groupCode,
                RestaurantId = restaurantId,
                CreatorId = userId,
                IsActive = true
            };

            _context.GroupOrderSessions.Add(session);
            await _context.SaveChangesAsync();

            await Groups.AddToGroupAsync(Context.ConnectionId, groupCode);
            await Clients.Caller.SendAsync("GroupCreated", groupCode, session.Id, session.CreatorId);
        }

        // Gruba katılma
        public async Task JoinGroup(string groupCode)
        {
            var session = await _context.GroupOrderSessions
                .FirstOrDefaultAsync(s => s.GroupCode == groupCode && s.IsActive);

            if (session != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, groupCode);
                await Clients.Group(groupCode).SendAsync("UserJoined", Context.ConnectionId);
                
                // Mevcut sepeti ve kurucu bilgisini yeni katılan kullanıcıya gönder
                var items = await _context.GroupOrderItems
                    .Where(i => i.GroupOrderSessionId == session.Id)
                    .ToListAsync();
                
                await Clients.Caller.SendAsync("SyncCart", items, session.CreatorId, session.Id);
            }
            else
            {
                await Clients.Caller.SendAsync("Error", "Grup bulunamadı veya pasif.");
            }
        }

        // Sepete ürün ekleme
        public async Task AddToGroupCart(string groupCode, int productId, string productName, decimal price, string userId, string userName)
        {
            var session = await _context.GroupOrderSessions
                .FirstOrDefaultAsync(s => s.GroupCode == groupCode && s.IsActive);

            if (session != null)
            {
                var existingItem = await _context.GroupOrderItems
                    .FirstOrDefaultAsync(i => i.GroupOrderSessionId == session.Id && i.ProductId == productId && i.AddedByUserId == userId);

                if (existingItem != null)
                {
                    existingItem.Quantity++;
                }
                else
                {
                    _context.GroupOrderItems.Add(new GroupOrderItem
                    {
                        GroupOrderSessionId = session.Id,
                        ProductId = productId,
                        ProductName = productName,
                        Price = price,
                        AddedByUserId = userId,
                        AddedByUserName = userName,
                        Quantity = 1
                    });
                }

                await _context.SaveChangesAsync();

                var allItems = await _context.GroupOrderItems
                    .Where(i => i.GroupOrderSessionId == session.Id)
                    .ToListAsync();

                await Clients.Group(groupCode).SendAsync("CartUpdated", allItems);
            }
        }

        // Sepetten ürün çıkarma
        public async Task RemoveFromGroupCart(string groupCode, int productId, string userId)
        {
             var session = await _context.GroupOrderSessions
                .FirstOrDefaultAsync(s => s.GroupCode == groupCode && s.IsActive);

            if (session != null)
            {
                var item = await _context.GroupOrderItems
                    .FirstOrDefaultAsync(i => i.GroupOrderSessionId == session.Id && i.ProductId == productId && i.AddedByUserId == userId);

                if (item != null)
                {
                    if (item.Quantity > 1)
                    {
                        item.Quantity--;
                    }
                    else
                    {
                        _context.GroupOrderItems.Remove(item);
                    }

                    await _context.SaveChangesAsync();

                    var allItems = await _context.GroupOrderItems
                        .Where(i => i.GroupOrderSessionId == session.Id)
                        .ToListAsync();

                    await Clients.Group(groupCode).SendAsync("CartUpdated", allItems);
                }
            }
        }
        // Gruptan ayrılma veya grubu iptal etme
        public async Task LeaveGroup(string groupCode, string userId)
        {
            var session = await _context.GroupOrderSessions
                .FirstOrDefaultAsync(s => s.GroupCode == groupCode && s.IsActive);

            if (session != null)
            {
                if (session.CreatorId == userId)
                {
                    // Kurucu ayrılıyorsa grubu kapat
                    session.IsActive = false;
                    await _context.SaveChangesAsync();
                    await Clients.Group(groupCode).SendAsync("GroupDisbanded", "Grup kurucusu ayrıldığı için grup dağıtıldı.");
                }
                else
                {
                    // Normal üye ayrılıyorsa sadece bildir (isteğe bağlı)
                    await Clients.Group(groupCode).SendAsync("UserLeft", userId);
                }
            }

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupCode);
        }
    }
}
