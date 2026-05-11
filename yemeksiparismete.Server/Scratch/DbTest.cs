using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using yemeksiparismete.Server.Data;

namespace yemeksiparismete.Server.Scratch
{
    public class DbTest
    {
        public static void Run()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlite("Data Source=yemeksiparis.db")
                .Options;

            using (var db = new AppDbContext(options))
            {
                var order = db.Orders.FirstOrDefault(o => o.Id == 18);
                if (order != null)
                {
                    Console.WriteLine($"Order 18 found. UserId: {order.UserId}, Status: {order.Status}");
                }
                else
                {
                    Console.WriteLine("Order 18 not found in DB.");
                }
            }
        }
    }
}
