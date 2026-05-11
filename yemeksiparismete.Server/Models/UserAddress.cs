namespace yemeksiparismete.Server.Models
{
    public class UserAddress
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string Title { get; set; } = "Ev"; 
        public int CityId { get; set; }
        public int DistrictId { get; set; }
        public string Neighborhood { get; set; } = string.Empty;
        public string Street { get; set; } = string.Empty;
        public string BuildingNo { get; set; } = string.Empty;
        public string Floor { get; set; } = string.Empty;
        public string ApartmentNo { get; set; } = string.Empty;
        public string Directions { get; set; } = string.Empty;
        
        public City? City { get; set; }
        public District? District { get; set; }
    }
}
