using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;

namespace AutoSeeder
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Starting FULL Automatic Database Seed...");
            string connectionString = "Server=METEHAN\\SQLEXPRESS;Database=YemekSiparisDb;Trusted_Connection=True;TrustServerCertificate=True;";

            using (var connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    Console.WriteLine("Connected to database.");

                    // 1. Clear Data
                    string[] tablesToClear = { "SupportMessages", "SavedCards", "UserAddresses", "OrderItems", "Orders", "Products", "Restaurants", "Districts", "Cities" };
                    foreach (var table in tablesToClear) ExecuteSql(connection, $"ALTER TABLE [{table}] NOCHECK CONSTRAINT ALL; DELETE FROM [{table}];");
                    foreach (var table in tablesToClear) ExecuteSql(connection, $"ALTER TABLE [{table}] CHECK CONSTRAINT ALL;");
                    Console.WriteLine("Database cleared.");

                    // 2. Cities & Districts
                    var cityData = new[] {
                        (Name: "İstanbul", Districts: new[] { "Beşiktaş", "Kadıköy", "Şişli" }),
                        (Name: "Ankara", Districts: new[] { "Çankaya", "Yenimahalle", "Keçiören" }),
                        (Name: "İzmir", Districts: new[] { "Konak", "Karşıyaka", "Bornova" })
                    };

                    foreach (var city in cityData)
                    {
                        int cityId = ExecuteInsertAndGetId(connection, $"INSERT INTO Cities (Name) VALUES (N'{city.Name}'); SELECT SCOPE_IDENTITY();");
                        foreach (var dist in city.Districts)
                        {
                            ExecuteSql(connection, $"INSERT INTO Districts (Name, CityId) VALUES (N'{dist}', {cityId});");
                        }
                    }
                    Console.WriteLine("Cities and Districts added.");

                    // 3. Admin User
                    string adminId = "";
                    using (var cmd = new SqlCommand("SELECT TOP 1 Id FROM AspNetUsers WHERE Email='admin@yemeksiparis.com'", connection))
                    {
                        var result = cmd.ExecuteScalar();
                        adminId = result?.ToString() ?? "";
                    }

                    // 4. Products Data
                    var commonDrinks = new[] {
                        (Name: "Coca-Cola (330ml)", Price: 45, Img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=400&fit=crop"),
                        (Name: "Fanta (330ml)", Price: 45, Img: "https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=600&h=400&fit=crop"),
                        (Name: "Ayran (300ml)", Price: 35, Img: "https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?w=600&h=400&fit=crop"),
                        (Name: "Su (500ml)", Price: 15, Img: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&h=400&fit=crop")
                    };

                    var categories = new[] {
                        new { Cat = "Burger", Logo = "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop", Banner = "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&h=600&fit=crop", Brands = new[] {
                            new { Name = "Burger King", Prods = new[] { 
                                (Name: "Whopper® Menü", Price: 265, Img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop"),
                                (Name: "Tavuk Burger", Price: 180, Img: "https://images.unsplash.com/photo-1615719417327-1fba69c76899?w=600&h=400&fit=crop"),
                                (Name: "Büyük Boy Patates", Price: 85, Img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=400&fit=crop"),
                                (Name: "Sufle", Price: 95, Img: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&h=400&fit=crop")
                            }},
                            new { Name = "Mc Donalds", Prods = new[] { 
                                (Name: "Big Mac™ Menü", Price: 245, Img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop"),
                                (Name: "McNuggets™ (6'lı)", Price: 120, Img: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&h=400&fit=crop")
                            }}
                        }},
                        new { Cat = "Pizza", Logo = "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=400&fit=crop", Banner = "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&h=600&fit=crop", Brands = new[] {
                            new { Name = "Domino's Pizza", Prods = new[] { 
                                (Name: "Karışık Pizza", Price: 280, Img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&h=400&fit=crop"),
                                (Name: "Sarımsaklı Ekmek", Price: 65, Img: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=600&h=400&fit=crop")
                            }}
                        }},
                        new { Cat = "Tatlı", Logo = "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop", Banner = "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200&h=600&fit=crop", Brands = new[] {
                            new { Name = "Mado", Prods = new[] { 
                                (Name: "Fıstıklı Baklava", Price: 450, Img: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&h=400&fit=crop"),
                                (Name: "Maraş Dondurması", Price: 180, Img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop")
                            }}
                        }}
                    };

                    // 5. Fill Restaurants and Products
                    var districts = new List<(int Id, string Name, string CityName)>();
                    using (var cmd = new SqlCommand("SELECT d.Id, d.Name, c.Name FROM Districts d JOIN Cities c ON d.CityId = c.Id", connection))
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read()) districts.Add((reader.GetInt32(0), reader.GetString(1), reader.GetString(2)));
                    }

                    foreach (var dist in districts)
                    {
                        foreach (var cat in categories)
                        {
                            foreach (var brand in cat.Brands)
                            {
                                string brandName = brand.Name.Replace("'", "''");
                                string distName = dist.Name.Replace("'", "''");
                                string cityName = dist.CityName.Replace("'", "''");
                                string catName = cat.Cat.Replace("'", "''");

                                int resId = ExecuteInsertAndGetId(connection, $@"
                                    INSERT INTO Restaurants (Name, OwnerId, DistrictId, Address, Rating, Description, Category, LogoUrl, BannerUrl, CreatedAt)
                                    VALUES (N'{brandName} - {distName}', '{adminId}', {dist.Id}, N'{distName}, {cityName}', 4.8, N'Bölgenin en iyi {catName.ToLower()} lezzeti.', N'{catName}', '{cat.Logo}', '{cat.Banner}', GETDATE());
                                    SELECT SCOPE_IDENTITY();
                                ");

                                foreach (var p in brand.Prods)
                                {
                                    string pName = p.Name.Replace("'", "''");
                                    ExecuteSql(connection, $"INSERT INTO Products (RestaurantId, Name, Price, Description, Stock, ImageUrl, Category) VALUES ({resId}, N'{pName}', {p.Price}, N'Harika lezzet.', 100, '{p.Img}', N'{catName}');");
                                }
                                foreach (var d in commonDrinks)
                                {
                                    string dName = d.Name.Replace("'", "''");
                                    ExecuteSql(connection, $"INSERT INTO Products (RestaurantId, Name, Price, Description, Stock, ImageUrl, Category) VALUES ({resId}, N'{dName}', {d.Price}, N'İçecek', 100, '{d.Img}', N'{catName}');");
                                }
                            }
                        }
                    }

                    Console.WriteLine("FULL Seeding completed successfully.");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                }
            }
        }

        static void ExecuteSql(SqlConnection connection, string sql)
        {
            using (var cmd = new SqlCommand(sql, connection)) cmd.ExecuteNonQuery();
        }

        static int ExecuteInsertAndGetId(SqlConnection connection, string sql)
        {
            using (var cmd = new SqlCommand(sql, connection))
            {
                var res = cmd.ExecuteScalar();
                return Convert.ToInt32(res);
            }
        }
    }
}
