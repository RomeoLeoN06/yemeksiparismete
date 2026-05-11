class Restaurant {
  final int id;
  final String? ownerId;
  final String name;
  final String? logo;
  final String? logoUrl;
  final String? bannerUrl;
  final String category;
  final String address;
  final String description;
  final double rating;

  Restaurant({
    required this.id,
    this.ownerId,
    required this.name,
    this.logo,
    this.logoUrl,
    this.bannerUrl,
    required this.category,
    required this.address,
    required this.description,
    required this.rating,
  });

  factory Restaurant.fromJson(Map<String, dynamic> json) {
    return Restaurant(
      id: json['id'] ?? 0,
      ownerId: json['ownerId'],
      name: json['name'] ?? '',
      logo: json['logo'],
      logoUrl: json['logoUrl'],
      bannerUrl: json['bannerUrl'],
      category: json['category'] ?? '',
      address: json['address'] ?? '',
      description: json['description'] ?? '',
      rating: (json['rating'] ?? 4.5).toDouble(),
    );
  }
}
