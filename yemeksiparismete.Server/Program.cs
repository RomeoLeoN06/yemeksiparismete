using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using yemeksiparismete.Server.Data;
using yemeksiparismete.Server.Hubs;
using yemeksiparismete.Server.Models;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

// DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options => {
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 8;
})
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.ASCII.GetBytes(jwtSettings.GetValue<string>("Key") ?? "yemeksiparismete_very_secret_key_1234567890");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        RoleClaimType = System.Security.Claims.ClaimTypes.Role
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/orderhub") || path.StartsWithSegments("/grouporderhub")))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
builder.Services.AddHttpClient();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

// Seed Database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    await DbSeeder.SeedAsync(services);
}

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

// --- TEK VE NET GÜNCELLEME HATTI ---
app.MapGet("/api/durum-guncelle/{id}/{status}", async (int id, string status, AppDbContext db, IHubContext<OrderHub> hubContext) => {
    var order = await db.Orders.FindAsync(id);
    if (order == null) return Results.NotFound("Siparis bulunamadi");
    
    order.Status = status;
    
    await db.SaveChangesAsync();
    await hubContext.Clients.All.SendAsync("UpdateStatus", id, status);
    return Results.Ok(new { success = true });
}).AllowAnonymous();

app.MapGet("/api/direct-orders", async (AppDbContext db) => {
    var orders = await db.Orders.Include(o => o.Items).OrderByDescending(o => o.OrderDate).ToListAsync();
    var result = orders.Select(o => new {
        o.Id, o.UserId, o.CustomerName, o.DeliveryAddress, o.CustomerPhone, o.TotalAmount, o.PaymentMethod, o.OrderDate, o.Items,
        o.Note, o.CouponCode, o.DiscountAmount,
        Status = o.Status
    });
    return Results.Ok(new { orders = result });
}).AllowAnonymous();

app.MapGet("/api/direct-customers", async (AppDbContext db) => {
    var orderGroups = await db.Orders
        .GroupBy(o => new { o.CustomerPhone, o.CustomerName, o.DeliveryAddress })
        .Select(g => new {
            CustomerName = g.Key.CustomerName,
            CustomerPhone = g.Key.CustomerPhone,
            DeliveryAddress = g.Key.DeliveryAddress,
            UserId = g.Max(o => o.UserId),
            TotalOrders = g.Count(),
            TotalSpent = g.Sum(o => o.TotalAmount),
            LastOrderDate = g.Max(o => o.OrderDate)
        })
        .OrderByDescending(c => c.LastOrderDate)
        .ToListAsync();

    var allUsers = await db.Users.ToListAsync();

    var customers = orderGroups.Select(c => {
        string? matchedUserId = c.UserId;
        string matchedEmail = "";
        
        // Eğer siparişte UserId yoksa, ismine (FullName) bakarak veritabanından ID'sini bul
        if (string.IsNullOrEmpty(matchedUserId)) {
            var foundUser = allUsers.FirstOrDefault(u => u.FullName != null && u.FullName.Trim().ToLower() == c.CustomerName.Trim().ToLower());
            if (foundUser != null) {
                matchedUserId = foundUser.Id;
                matchedEmail = foundUser.Email ?? "";
            }
        } else {
            var foundUser = allUsers.FirstOrDefault(u => u.Id == matchedUserId);
            if (foundUser != null) {
                matchedEmail = foundUser.Email ?? "";
            }
        }
        
        return new {
            c.CustomerName,
            c.CustomerPhone,
            c.DeliveryAddress,
            UserId = matchedUserId,
            c.TotalOrders,
            c.TotalSpent,
            c.LastOrderDate
        };
    }).ToList();

    return Results.Ok(new { customers });
}).AllowAnonymous();

app.MapControllers();
app.MapHub<OrderHub>("/orderhub");
app.MapHub<GroupOrderHub>("/grouporderhub");
app.MapFallbackToFile("/index.html");

app.Run();

public class StatusUpdateDto {
    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;
}