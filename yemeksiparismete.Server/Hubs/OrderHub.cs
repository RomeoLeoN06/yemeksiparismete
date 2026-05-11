using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace yemeksiparismete.Server.Hubs
{
    public class OrderHub : Hub
    {
        // İstemciler (admin veya restoran sahipleri) bu gruba katılabilir
        public async Task JoinAdminGroup()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");
        }

        public async Task LeaveAdminGroup()
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "Admins");
        }
    }
}
