using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using yemeksiparismete.Server.Models;

namespace yemeksiparismete.Server.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<District> Districts { get; set; }
        public DbSet<SupportMessage> SupportMessages { get; set; }
        public DbSet<UserAddress> UserAddresses { get; set; }
        public DbSet<SavedCard> SavedCards { get; set; }
        public DbSet<ChatSession> ChatSessions { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<RestaurantRating> RestaurantRatings { get; set; }
        public DbSet<CourierApplication> CourierApplications { get; set; }
        public DbSet<Coupon> Coupons { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // SQL Server'da birden fazla cascade (silme) yoluna izin verilmediği için bu ilişkileri kısıtlıyoruz
            modelBuilder.Entity<UserAddress>()
                .HasOne(u => u.City)
                .WithMany()
                .HasForeignKey(u => u.CityId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserAddress>()
                .HasOne(u => u.District)
                .WithMany()
                .HasForeignKey(u => u.DistrictId)
                .OnDelete(DeleteBehavior.Restrict);
            
            // SQL Server Tablo İsimleri (KESİN EŞLEŞTİRME - Error 208 Fix)
            modelBuilder.Entity<City>().ToTable("Cities", "dbo");
            modelBuilder.Entity<District>().ToTable("Districts", "dbo");
            modelBuilder.Entity<Order>().ToTable("Orders", "dbo");
            modelBuilder.Entity<OrderItem>().ToTable("OrderItems", "dbo");
            modelBuilder.Entity<RestaurantRating>().ToTable("RestaurantRatings", "dbo");
            modelBuilder.Entity<Restaurant>().ToTable("Restaurants", "dbo");
            modelBuilder.Entity<Product>().ToTable("Products", "dbo");
            modelBuilder.Entity<UserAddress>().ToTable("UserAddresses", "dbo");
            modelBuilder.Entity<SavedCard>().ToTable("SavedCards", "dbo");
            modelBuilder.Entity<SupportMessage>().ToTable("SupportMessages", "dbo");
            modelBuilder.Entity<ChatSession>().ToTable("ChatSessions", "dbo");
            modelBuilder.Entity<ChatMessage>().ToTable("ChatMessages", "dbo");
            modelBuilder.Entity<Coupon>().ToTable("Coupons", "dbo");

            // İlişki Tanımlamaları
            modelBuilder.Entity<District>()
                .HasMany(d => d.Restaurants)
                .WithOne()
                .HasForeignKey(r => r.DistrictId)
                .OnDelete(DeleteBehavior.Restrict);

            // Restoran ve Ürün ilişkisini netleştiriyoruz
            modelBuilder.Entity<Restaurant>()
                .HasMany<Product>()
                .WithOne()
                .HasForeignKey(p => p.RestaurantId)
                .OnDelete(DeleteBehavior.Cascade);

            // Decimal Hassasiyet Ayarları (Warning EF30000 Fix)
            modelBuilder.Entity<Order>().Property(o => o.TotalAmount).HasPrecision(18, 2);
            modelBuilder.Entity<Order>().Property(o => o.DiscountAmount).HasPrecision(18, 2);
            modelBuilder.Entity<OrderItem>().Property(oi => oi.Price).HasPrecision(18, 2);
            modelBuilder.Entity<Product>().Property(p => p.Price).HasPrecision(18, 2);
            modelBuilder.Entity<Coupon>().Property(c => c.DiscountAmount).HasPrecision(18, 2);
            modelBuilder.Entity<Coupon>().Property(c => c.MinimumOrderAmount).HasPrecision(18, 2);
        }
    }
}
