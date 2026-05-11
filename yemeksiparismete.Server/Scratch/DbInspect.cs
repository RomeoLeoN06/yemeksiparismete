using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using yemeksiparismete.Server.Data;

namespace yemeksiparismete.Server.Scratch
{
    public class DbInspect
    {
        public static void Run()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlite("Data Source=yemeksiparis.db")
                .Options;

            using (var db = new AppDbContext(options))
            {
                var orders = db.Orders.OrderByDescending(o => o.Id).Take(20).ToList();
                Console.WriteLine("ID | UserEmail | CustomerName | Status");
                Console.WriteLine("---------------------------------------");
                foreach (var o in orders)
                {
                    Console.WriteLine($"{o.Id} | {o.UserEmail} | {o.CustomerName} | {o.Status}");
                }
            }
        }
    }
}
