using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using yemeksiparismete.Server.Data;
using yemeksiparismete.Server.Models;

namespace yemeksiparismete.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CitiesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CitiesController(AppDbContext context) { _context = context; }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<City>>> Get()
        {
            return await _context.Cities.OrderBy(c => c.Name).ToListAsync();
        }

        [HttpGet("{cityId}/districts")]
        public async Task<ActionResult<IEnumerable<District>>> GetDistricts(int cityId)
        {
            return await _context.Districts.Where(d => d.CityId == cityId).OrderBy(d => d.Name).ToListAsync();
        }
    }
}
