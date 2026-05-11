using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using yemeksiparismete.Server.Data;
using yemeksiparismete.Server.Models;

namespace yemeksiparismete.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RestaurantsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RestaurantsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Restaurant>>> Get([FromQuery] int? districtId)
        {
            var query = _context.Restaurants.AsQueryable();
            if (districtId.HasValue)
            {
                Console.WriteLine($"[SQL_TRACE] Get Filtered: DistrictId={districtId.Value}");
                query = query.Where(r => r.DistrictId == districtId.Value);
            }
            else
            {
                Console.WriteLine("[SQL_TRACE] Get All: No districtId provided.");
            }
            var result = await query.ToListAsync();
            Console.WriteLine($"[SQL_TRACE] Returned {result.Count} restaurants.");
            return result;
        }

        [HttpGet("district/{districtId}")]
        public async Task<ActionResult<IEnumerable<Restaurant>>> GetByDistrict(int districtId)
        {
            Console.WriteLine($"[SQL_TRACE] GetByDistrict ID: {districtId}");
            var restaurants = await _context.Restaurants
                .Where(r => r.DistrictId == districtId)
                .ToListAsync();
            Console.WriteLine($"[SQL_TRACE] Found {restaurants.Count} restaurants for ID {districtId}");
            return restaurants;
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Restaurant>>> GetAll()
        {
            Console.WriteLine("[SQL_TRACE] GetAll called");
            var all = await _context.Restaurants.ToListAsync();
            Console.WriteLine($"[SQL_TRACE] Total restaurants in DB: {all.Count}");
            return all;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Restaurant>> Get(int id)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);
            if (restaurant == null) return NotFound();
            return restaurant;
        }

        [HttpPost]
        public async Task<ActionResult<Restaurant>> Post(Restaurant restaurant)
        {
            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = restaurant.Id }, restaurant);
        }
    }
}
