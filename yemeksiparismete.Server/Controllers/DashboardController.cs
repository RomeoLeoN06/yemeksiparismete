using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using yemeksiparismete.Server.Data;
using yemeksiparismete.Server.Models;
using System.Security.Claims;

namespace yemeksiparismete.Server.Controllers
{
    [Authorize(Roles = "admin,restaurant_owner")]
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public DashboardController(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var currentUser = await _userManager.FindByIdAsync(userId);
            
            // Daha esnek Admin kontrolü (hem claim hem DB rolü)
            bool isAdmin = User.IsInRole("admin") || 
                          (currentUser?.Role?.ToLower() == "admin") || 
                          (currentUser?.Email == "admin@yemeksiparis.com");

            Console.WriteLine($"Dashboard Stats Request: User={currentUser?.Email}, IsAdmin={isAdmin}");

            IQueryable<Order> ordersQuery = _context.Orders.Include(o => o.Items);
            IQueryable<Product> productsQuery = _context.Products;

            if (!isAdmin)
            {
                var myRestaurantIds = await _context.Restaurants
                    .Where(r => r.OwnerId == userId)
                    .Select(r => r.Id)
                    .ToListAsync();

                if (myRestaurantIds.Any())
                {
                    ordersQuery = ordersQuery.Where(o => o.Items.Any(i => 
                        _context.Products.Any(p => p.Id == i.ProductId && myRestaurantIds.Contains(p.RestaurantId))));
                    productsQuery = productsQuery.Where(p => myRestaurantIds.Contains(p.RestaurantId));
                }
                else 
                {
                    ordersQuery = ordersQuery.Where(o => false);
                    productsQuery = productsQuery.Where(p => false);
                }
            }

            var totalOrders = await ordersQuery.CountAsync();
            var activeMenus = await productsQuery.CountAsync();
            var totalUsers = await _userManager.Users.CountAsync();
            var totalRestaurants = await _context.Restaurants.CountAsync();
            
            var monthlyEarnings = await ordersQuery
                .Select(o => o.TotalAmount)
                .DefaultIfEmpty(0)
                .SumAsync();

            var recentOrders = await ordersQuery
                .OrderByDescending(o => o.OrderDate)
                .Take(50) // Daha fazla sipariş göster
                .Select(o => new {
                    o.Id,
                    o.OrderDate,
                    o.TotalAmount,
                    o.Status,
                    o.CustomerName,
                    o.DeliveryAddress,
                    o.CustomerPhone,
                    Items = o.Items.Select(i => new { i.ProductName, i.Quantity, i.Price })
                })
                .ToListAsync();

            var restaurantsByCategory = await _context.Restaurants
                .GroupBy(r => r.Category)
                .Select(g => new { 
                    Category = g.Key ?? "Diğer", 
                    Count = g.Count() 
                })
                .ToListAsync();

            return Ok(new
            {
                totalOrders,
                activeMenus,
                totalUsers,
                totalRestaurants,
                monthlyEarnings,
                recentOrders,
                restaurantsByCategory,
                isAdmin, // Frontend'e admin olup olmadığını gönder
                allUsers = await _userManager.Users.Select(u => new { u.Id, u.FullName, u.Email, u.PhoneNumber, u.Role }).ToListAsync()
            });
        }
    }
}
