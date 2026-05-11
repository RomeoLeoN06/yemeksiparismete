using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using yemeksiparismete.Server.Data;
using yemeksiparismete.Server.Models;

namespace yemeksiparismete.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CouponsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public class CouponValidationResult
        {
            public bool IsValid { get; set; }
            public string Message { get; set; }
            public decimal DiscountAmount { get; set; }
            public decimal MinimumOrderAmount { get; set; }
            public string Code { get; set; }
        }

        public CouponsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCoupons()
        {
            var coupons = await _context.Coupons
                .Where(c => c.IsActive && c.ExpiryDate > DateTime.Now)
                .OrderByDescending(c => c.DiscountAmount)
                .ToListAsync();
            return Ok(coupons);
        }

        [HttpGet("validate/{code}")]
        public async Task<IActionResult> ValidateCoupon(string code)
        {
            var coupon = await _context.Coupons
                .FirstOrDefaultAsync(c => c.Code == code && c.IsActive);

            if (coupon == null)
            {
                return NotFound(new { message = "Geçersiz veya süresi dolmuş kupon kodu." });
            }

            if (coupon.ExpiryDate < DateTime.Now)
            {
                return BadRequest(new { message = "Bu kuponun süresi dolmuş." });
            }

            return Ok(new
            {
                isValid = true,
                code = coupon.Code,
                discountAmount = coupon.DiscountAmount,
                minimumOrderAmount = coupon.MinimumOrderAmount
            });
        }
    }
}
