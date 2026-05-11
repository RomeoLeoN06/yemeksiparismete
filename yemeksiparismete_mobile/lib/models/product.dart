class Product {
  final int id;
  final int restaurantId;
  final String name;
  final double price;
  final String description;
  final int stock;
  final String? imageUrl;
  final String category;

  Product({
    required this.id,
    required this.restaurantId,
    required this.name,
    required this.price,
    required this.description,
    required this.stock,
    this.imageUrl,
    required this.category,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] ?? 0,
      restaurantId: json['restaurantId'] ?? 0,
      name: json['name'] ?? '',
      price: (json['price'] ?? 0.0).toDouble(),
      description: json['description'] ?? '',
      stock: json['stock'] ?? 0,
      imageUrl: json['imageUrl'],
      category: json['category'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'restaurantId': restaurantId,
      'name': name,
      'price': price,
      'description': description,
      'stock': stock,
      'imageUrl': imageUrl,
      'category': category,
    };
  }
}
