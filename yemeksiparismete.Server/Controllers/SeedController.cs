using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using yemeksiparismete.Server.Data;

namespace yemeksiparismete.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly AppDbContext _context;

        public SeedController(IServiceProvider serviceProvider, AppDbContext context)
        {
            _serviceProvider = serviceProvider;
            _context = context;
        }

        [HttpPost("run")]
        public async Task<IActionResult> RunSeed()
        {
            try
            {
                var tables = new[] { 
                    "SupportMessages", "SavedCards", "UserAddresses", 
                    "OrderItems", "Orders", "Products", 
                    "Restaurants", "Districts", "Cities" 
                };

                // Kısıtlamaları kapat
                foreach (var table in tables)
#pragma warning disable EF1002
                    await _context.Database.ExecuteSqlRawAsync($"ALTER TABLE [{table}] NOCHECK CONSTRAINT ALL");
#pragma warning restore EF1002

                // Verileri sil
                foreach (var table in tables)
#pragma warning disable EF1002
                    await _context.Database.ExecuteSqlRawAsync($"DELETE FROM [{table}]");
#pragma warning restore EF1002

                // Kısıtlamaları aç
                foreach (var table in tables)
#pragma warning disable EF1002
                    await _context.Database.ExecuteSqlRawAsync($"ALTER TABLE [{table}] CHECK CONSTRAINT ALL");
#pragma warning restore EF1002

                // Seed işlemini başlat
                await DbSeeder.SeedAsync(_serviceProvider);
                
                return Ok(new { message = "Veritabanı başarıyla yeni çeşitlerle güncellendi!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    error = ex.Message, 
                    detail = ex.InnerException?.Message,
                    stack = ex.StackTrace 
                });
            }
        }
    }
}
