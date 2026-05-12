using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.Data.SqlClient;
using System.Data;

namespace yemeksiparismete.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MigrationController : ControllerBase
    {
        private readonly IConfiguration _config;

        public MigrationController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet("run")]
        public async Task<IActionResult> RunMigration()
        {
            var sqlitePath = Path.Combine(Directory.GetCurrentDirectory(), "yemeksiparis.db");
            if (!System.IO.File.Exists(sqlitePath)) return BadRequest("SQLite db not found.");

            var sqlConnectionString = _config.GetConnectionString("DefaultConnection");

            var tables = new[] { 
                "AspNetRoles", "AspNetUsers", "AspNetRoleClaims", "AspNetUserClaims", "AspNetUserLogins", "AspNetUserRoles", "AspNetUserTokens",
                "Cities", "Districts", "Restaurants", "Products", "UserAddresses", "Orders", "OrderItems"
            };

            var logs = new List<string>();

            try
            {
                using var sqliteConn = new SqliteConnection($"Data Source={sqlitePath}");
                await sqliteConn.OpenAsync();

                using var sqlConn = new SqlConnection(sqlConnectionString);
                await sqlConn.OpenAsync();

                // QUOTED_IDENTIFIER hatasını önlemek için ayarı aktif et
                using (var qCmd = new SqlCommand("SET QUOTED_IDENTIFIER ON;", sqlConn))
                    await qCmd.ExecuteNonQueryAsync();

                // 1. Kısıtlamaları (Foreign Key) devre dışı bırak (sadece kendi tablolarımızda)
                foreach (var table in tables)
                {
                    using var cmd = new SqlCommand($"ALTER TABLE [{table}] NOCHECK CONSTRAINT ALL", sqlConn);
                    await cmd.ExecuteNonQueryAsync();
                }

                // 2. SQL Server'daki mevcut tüm test/seed verilerini temizle (sadece kendi tablolarımızda)
                foreach (var table in tables.Reverse())
                {
                    using var cmd = new SqlCommand($"DELETE FROM [{table}]", sqlConn);
                    await cmd.ExecuteNonQueryAsync();
                }

                // 3. Tabloları tek tek taşı
                foreach (var table in tables)
                {
                    var dt = new DataTable();
                    using (var sqliteCmd = new SqliteCommand($"SELECT * FROM {table}", sqliteConn))
                    using (var reader = await sqliteCmd.ExecuteReaderAsync())
                    {
                        dt.Load(reader);
                    }

                    if (dt.Rows.Count == 0) continue;

                    bool hasIdentity = false;
                    // Tabloda IDENTITY kolonu var mı kontrol et
                    using (var checkCmd = new SqlCommand($"SELECT OBJECTPROPERTY(OBJECT_ID('{table}'), 'TableHasIdentity')", sqlConn))
                    {
                        var result = await checkCmd.ExecuteScalarAsync();
                        hasIdentity = result != null && result != DBNull.Value && Convert.ToInt32(result) == 1;
                    }

                    if (hasIdentity)
                    {
                        using var cmd = new SqlCommand($"SET IDENTITY_INSERT [{table}] ON", sqlConn);
                        await cmd.ExecuteNonQueryAsync();
                    }

                    foreach (DataRow row in dt.Rows)
                    {
                        var cols = new List<string>();
                        var vals = new List<string>();
                        for (int i = 0; i < dt.Columns.Count; i++)
                        {
                            cols.Add($"[{dt.Columns[i].ColumnName}]");
                            var val = row[i];
                            if (val == DBNull.Value) vals.Add("NULL");
                            else if (val is string s) vals.Add($"N'{s.Replace("'", "''")}'");
                            else if (val is DateTime d) vals.Add($"'{d:yyyy-MM-dd HH:mm:ss.fff}'");
                            else if (val is bool b) vals.Add(b ? "1" : "0");
                            else if (val is byte[] arr) vals.Add($"0x{BitConverter.ToString(arr).Replace("-", "")}");
                            else vals.Add(val.ToString()!.Replace(",", "."));
                        }

                        var insertSql = $"SET QUOTED_IDENTIFIER ON; INSERT INTO [{table}] ({string.Join(", ", cols)}) VALUES ({string.Join(", ", vals)})";
                        using var insertCmd = new SqlCommand(insertSql, sqlConn);
                        try {
                            await insertCmd.ExecuteNonQueryAsync();
                        } catch (Exception ex) {
                            logs.Add($"Hata {table}: {ex.Message}");
                        }
                    }

                    if (hasIdentity)
                    {
                        using var cmd = new SqlCommand($"SET IDENTITY_INSERT [{table}] OFF", sqlConn);
                        await cmd.ExecuteNonQueryAsync();
                    }

                    logs.Add($"Başarılı: {table} tablosundan {dt.Rows.Count} satır aktarıldı.");
                }

                // 4. Kısıtlamaları geri aç
                foreach (var table in tables)
                {
                    using var cmd = new SqlCommand($"ALTER TABLE [{table}] WITH CHECK CHECK CONSTRAINT ALL", sqlConn);
                    await cmd.ExecuteNonQueryAsync();
                }

                return Ok(new { message = "SQLite verileri SQL Server'a başarıyla taşındı!", logs });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, logs });
            }
        }

        [HttpGet("fix-phones")]
        public async Task<IActionResult> FixPhones()
        {
            var sqlConnectionString = _config.GetConnectionString("DefaultConnection");
            try
            {
                using var sqlConn = new SqlConnection(sqlConnectionString);
                await sqlConn.OpenAsync();
                
                // Orders tablosundaki eksik telefon numaralarını AspNetUsers tablosundan tamamla
                var updateSql = @"
                    UPDATE O
                    SET O.CustomerPhone = U.PhoneNumber
                    FROM Orders O
                    INNER JOIN AspNetUsers U ON O.UserId = U.Id
                    WHERE (O.CustomerPhone = '-' OR O.CustomerPhone IS NULL OR O.CustomerPhone = '')
                    AND U.PhoneNumber IS NOT NULL AND U.PhoneNumber != ''";
                    
                using var cmd = new SqlCommand(updateSql, sqlConn);
                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                
                return Ok(new { 
                    message = $"Başarıyla {rowsAffected} siparişin telefon numarası güncellendi.", 
                    rowsAffected,
                    note = "Eğer hala '-' görünüyorsa, kullanıcıların AspNetUsers tablosunda PhoneNumber alanları boş olabilir."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
        [HttpGet("fix-restaurants")]
        public async Task<IActionResult> FixRestaurants()
        {
            var sqlConnectionString = _config.GetConnectionString("DefaultConnection");
            try
            {
                using var sqlConn = new SqlConnection(sqlConnectionString);
                await sqlConn.OpenAsync();
                
                // Orders tablosundaki eksik RestaurantId alanlarını OrderItems üzerinden Product->RestaurantId ile eşleştir
                var updateSql = @"
                    UPDATE O
                    SET O.RestaurantId = P.RestaurantId
                    FROM Orders O
                    INNER JOIN OrderItems OI ON O.Id = OI.OrderId
                    INNER JOIN Products P ON OI.ProductId = P.Id
                    WHERE O.RestaurantId IS NULL";
                    
                using var cmd = new SqlCommand(updateSql, sqlConn);
                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                
                return Ok(new { 
                    message = $"Başarıyla {rowsAffected} siparişin restoran eşleştirmesi yapıldı.", 
                    rowsAffected
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
