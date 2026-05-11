using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using yemeksiparismete.Server.Data;

namespace yemeksiparismete.Server.Scratch
{
    public class DbCheck
    {
        public static void RunCheck()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlite("Data Source=yemeksiparismete.db")
                .Options;

            using (var db = new AppDbContext(options))
            {
                Console.WriteLine($"Total Users: {db.Users.Count()}");
                Console.WriteLine($"Total Orders: {db.Orders.Count()}");
                Console.WriteLine($"Total Products: {db.Products.Count()}");
                
                var latestOrders = db.Orders.OrderByDescending(o => o.OrderDate).Take(5).ToList();
                foreach(var o in latestOrders) {
                    Console.WriteLine($"Order #{o.Id} - {o.TotalAmount} TL - {o.OrderDate}");
                }
            }
        }
    }
}
