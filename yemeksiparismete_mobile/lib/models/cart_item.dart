import '../models/product.dart';

class CartItem {
  final Product product;
  int quantity;
  final String? restaurantName;
  final String? restaurantAddress;

  CartItem({
    required this.product,
    this.quantity = 1,
    this.restaurantName,
    this.restaurantAddress,
  });

  double get totalPrice => product.price * quantity;

  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      product: Product.fromJson(json['product']),
      quantity: json['quantity'] ?? 1,
      restaurantName: json['restaurantName'],
      restaurantAddress: json['restaurantAddress'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'product': product.toJson(),
      'quantity': quantity,
      'restaurantName': restaurantName,
      'restaurantAddress': restaurantAddress,
    };
  }
}
