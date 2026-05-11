using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using yemeksiparismete.Server.Data;
using yemeksiparismete.Server.Models;

namespace yemeksiparismete.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CourierController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CourierController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("apply")]
        public async Task<IActionResult> Apply([FromBody] CourierApplication application)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            application.ApplicationDate = DateTime.UtcNow;
            application.Status = "Pending";
            
            _context.CourierApplications.Add(application);
            await _context.SaveChangesAsync();
            
            return Ok(new { success = true, message = "Başvurunuz başarıyla alındı. Ekibimiz sizinle en kısa sürede iletişime geçecektir!" });
        }
        
        [HttpGet("applications")]
        public async Task<IActionResult> GetApplications()
        {
            var apps = await _context.CourierApplications
                .OrderByDescending(a => a.ApplicationDate)
                .ToListAsync();
                
            return Ok(apps);
        }
        
        [HttpPut("applications/{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string newStatus)
        {
            var application = await _context.CourierApplications.FindAsync(id);
            if (application == null) return NotFound();
            
            application.Status = newStatus;
            await _context.SaveChangesAsync();
            
            return Ok(new { success = true });
        }
    }
}
