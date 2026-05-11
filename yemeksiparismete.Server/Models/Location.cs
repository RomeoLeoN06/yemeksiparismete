using System.Collections.Generic;

namespace yemeksiparismete.Server.Models
{
    public class City
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<District> Districts { get; set; } = new();
    }

    public class District
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int CityId { get; set; }
        public List<Restaurant> Restaurants { get; set; } = new();
    }
}
