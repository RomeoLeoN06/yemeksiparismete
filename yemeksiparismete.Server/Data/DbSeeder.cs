using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using yemeksiparismete.Server.Models;
using System.Linq;

namespace yemeksiparismete.Server.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            Console.WriteLine("--- SEEDING DATABASE ---");

            // 1. Roles
            string[] roles = { "admin", "restaurant_owner", "customer" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // 2. Main Admin
            ApplicationUser? mainAdmin = await userManager.FindByEmailAsync("admin@yemeksiparis.com");
            if (mainAdmin == null)
            {
                mainAdmin = new ApplicationUser { UserName = "admin@yemeksiparis.com", Email = "admin@yemeksiparis.com", FullName = "Sistem Yöneticisi", Role = "admin", EmailConfirmed = true };
                await userManager.CreateAsync(mainAdmin, "Admin123!");
                await userManager.AddToRoleAsync(mainAdmin, "admin");
            }

            // 3. Cities & Districts

            var cityData = new List<(string Name, string[] Districts)>
            {
                ("İstanbul", new[] { "Beşiktaş", "Kadıköy", "Şişli" }),
                ("Ankara", new[] { "Çankaya", "Yenimahalle", "Keçiören" }),
                ("İzmir", new[] { "Konak", "Karşıyaka", "Bornova" })
            };

            if (!await context.Cities.AnyAsync())
            {
                var cities = new List<City>();
                foreach (var (name, districts) in cityData)
                {
                    var city = new City { Name = name };
                    foreach (var dName in districts) city.Districts.Add(new District { Name = dName });
                    cities.Add(city);
                }
                context.Cities.AddRange(cities);
                await context.SaveChangesAsync();
            }

            // 4. Products & Restaurants
            if (!await context.Restaurants.AnyAsync())
            {
                var commonDrinks = new[] {
                    new { Name = "Coca-Cola (330ml)", Price = 45m, Img = "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=400&fit=crop" },
                    new { Name = "Ayran (300ml)", Price = 35m, Img = "https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?w=600&h=400&fit=crop" },
                    new { Name = "Su (500ml)", Price = 15m, Img = "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&h=400&fit=crop" }
                };

                var brands = new[] {
                    new { Name = "Burger King", Cat = "Burger", Logo = "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop", Prods = new[] { new { Name = "Whopper Menü", Price = 265m, Img = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop" }, new { Name = "Patates Kızartması", Price = 85m, Img = "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=400&fit=crop" } } },
                    new { Name = "Mc Donalds", Cat = "Burger", Logo = "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop", Prods = new[] { new { Name = "Big Mac Menü", Price = 245m, Img = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop" } } },
                    new { Name = "Domino's Pizza", Cat = "Pizza", Logo = "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=400&fit=crop", Prods = new[] { new { Name = "Karışık Pizza", Price = 280m, Img = "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&h=400&fit=crop" } } },
                    new { Name = "Pizza Hut", Cat = "Pizza", Logo = "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=400&fit=crop", Prods = new[] { new { Name = "Margarita", Price = 220m, Img = "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop" } } },
                    new { Name = "HD İskender", Cat = "Kebap", Logo = "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=400&fit=crop", Prods = new[] { new { Name = "1.5 İskender", Price = 350m, Img = "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&h=400&fit=crop" }, new { Name = "Künefe", Price = 140m, Img = "https://images.unsplash.com/photo-1620921294026-76295321d261?w=600&h=400&fit=crop" } } },
                    new { Name = "KasapDöner", Cat = "Kebap", Logo = "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=400&fit=crop", Prods = new[] { new { Name = "Döner Dürüm", Price = 180m, Img = "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&h=400&fit=crop" } } },
                    new { Name = "Starbucks", Cat = "Kahve", Logo = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop", Prods = new[] { new { Name = "Latte", Price = 110m, Img = "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600&h=400&fit=crop" }, new { Name = "Havuçlu Kek", Price = 95m, Img = "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?w=600&h=400&fit=crop" } } },
                    new { Name = "Kahve Dünyası", Cat = "Kahve", Logo = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop", Prods = new[] { new { Name = "Türk Kahvesi", Price = 80m, Img = "https://images.unsplash.com/photo-1574889704250-705b7661b025?w=600&h=400&fit=crop" } } },
                    new { Name = "Mado", Cat = "Tatlı", Logo = "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop", Prods = new[] { new { Name = "Fıstıklı Baklava", Price = 450m, Img = "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&h=400&fit=crop" } } },
                    new { Name = "Özsüt", Cat = "Tatlı", Logo = "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop", Prods = new[] { new { Name = "Cheesecake", Price = 180m, Img = "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&h=400&fit=crop" } } }
                };

                var dbCities = await context.Cities.Include(c => c.Districts).ToListAsync();
                foreach (var city in dbCities)
                {
                    foreach (var district in city.Districts)
                    {
                        for (int i = 0; i < brands.Length; i++)
                        {
                            var b = brands[i];
                            
                            // Create a unique owner for this restaurant
                            string rawEmail = $"{b.Name.Replace(" ", "").Replace("'", "").ToLower()}_{district.Name.ToLower()}@yemeksiparis.com";
                            string email = rawEmail.Replace("ı", "i").Replace("ş", "s").Replace("ğ", "g").Replace("ü", "u").Replace("ö", "o").Replace("ç", "c");
                            
                            ApplicationUser owner = new ApplicationUser 
                            { 
                                UserName = email, 
                                Email = email, 
                                FullName = $"{b.Name} {district.Name} Şubesi", 
                                Role = "restaurant_owner", 
                                EmailConfirmed = true,
                                RecoveryCode = Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper()
                            };
                            await userManager.CreateAsync(owner, "Restoran123!");
                            await userManager.AddToRoleAsync(owner, "restaurant_owner");

                            var res = new Restaurant
                            {
                                Name = $"{b.Name} - {district.Name}",
                                OwnerId = owner.Id,
                                DistrictId = district.Id,
                                Address = $"{district.Name}, {city.Name}",
                                Rating = Math.Round(4.5 + (new Random().NextDouble() * 0.5), 1),
                                Category = b.Cat,
                                LogoUrl = b.Logo,
                                BannerUrl = b.Logo.Replace("w=400&h=400", "w=1200&h=600"),
                                Description = $"{b.Name} kalitesiyle harika lezzetler.",
                                CreatedAt = DateTime.Now
                            };
                            context.Restaurants.Add(res);
                            await context.SaveChangesAsync();

                            foreach (var p in b.Prods)
                            {
                                context.Products.Add(new Product { RestaurantId = res.Id, Name = p.Name, Price = p.Price, ImageUrl = p.Img, Category = b.Cat, Description = "Taze ve lezzetli.", Stock = 100 });
                            }
                            foreach (var d in commonDrinks)
                            {
                                context.Products.Add(new Product { RestaurantId = res.Id, Name = d.Name, Price = d.Price, ImageUrl = d.Img, Category = b.Cat, Description = "İçecek", Stock = 100 });
                            }
                        }
                    }
                }
                await context.SaveChangesAsync();
            }

            // 5. Global Coupons
            if (!await context.Coupons.AnyAsync())
            {
                var coupons = new List<Coupon>
                {
                    new Coupon { Code = "METE50", DiscountAmount = 50, MinimumOrderAmount = 300 },
                    new Coupon { Code = "YEMEK20", DiscountAmount = 20, MinimumOrderAmount = 300 },
                    new Coupon { Code = "HOŞGELDİN100", DiscountAmount = 100, MinimumOrderAmount = 500 }
                };
                context.Coupons.AddRange(coupons);
                await context.SaveChangesAsync();
            }

            Console.WriteLine("--- SEEDING COMPLETED ---");
        }
    }
}
