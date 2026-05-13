import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/cart_item.dart';
import '../models/product.dart';

class CartProvider with ChangeNotifier {
  Map<int, CartItem> _items = {};

  CartProvider() {
    _loadCart();
  }

  Map<int, CartItem> get items => {..._items};

  int get itemCount {
    var total = 0;
    _items.forEach((key, item) => total += item.quantity);
    return total;
  }

  double get totalAmount {
    var total = 0.0;
    _items.forEach((key, cartItem) {
      total += cartItem.product.price * cartItem.quantity;
    });
    return total;
  }

  String? _couponCode;
  double _discountAmount = 0.0;
  List<dynamic> _availableCoupons = [];

  String? get couponCode => _couponCode;
  double get discountAmount => _discountAmount;
  List<dynamic> get availableCoupons => _availableCoupons;

  void setAvailableCoupons(List<dynamic> coupons) {
    _availableCoupons = coupons;
    notifyListeners();
  }

  void autoApplyBestCoupon() {
    if (_availableCoupons.isEmpty) return;
    
    var validCoupons = _availableCoupons.where((c) {
      final min = (c['minimumOrderAmount'] ?? c['MinimumOrderAmount'] ?? 0).toDouble();
      return totalAmount >= min;
    }).toList();

    if (validCoupons.isEmpty) return;

    validCoupons.sort((a, b) {
      final discA = (a['discountAmount'] ?? a['DiscountAmount'] ?? 0).toDouble();
      final discB = (b['discountAmount'] ?? b['DiscountAmount'] ?? 0).toDouble();
      return discB.compareTo(discA);
    });

    final best = validCoupons.first;
    setCoupon(best['code'] ?? best['Code'], (best['discountAmount'] ?? best['DiscountAmount'] ?? 0).toDouble());
  }

  double get finalAmount {
    double finalVal = totalAmount - _discountAmount;
    return finalVal < 0 ? 0 : finalVal;
  }

  void setCoupon(String code, double discount) {
    _couponCode = code;
    _discountAmount = discount;
    notifyListeners();
  }

  void clearCoupon() {
    _couponCode = null;
    _discountAmount = 0.0;
    notifyListeners();
  }


  void addItem(Product product, {String? restaurantName, String? restaurantAddress}) {
    // Farklı bir restorandan ürün ekleniyorsa sepeti temizleyelim
    if (_items.isNotEmpty) {
      final firstItem = _items.values.first;
      if (firstItem.restaurantName != restaurantName) {
        _items.clear();
      }
    }

    if (_items.containsKey(product.id)) {
      _items.update(
        product.id,
        (existingCartItem) => CartItem(
          product: existingCartItem.product,
          quantity: existingCartItem.quantity + 1,
          restaurantName: existingCartItem.restaurantName ?? restaurantName,
          restaurantAddress: existingCartItem.restaurantAddress ?? restaurantAddress,
        ),
      );
    } else {
      _items.putIfAbsent(
        product.id,
        () => CartItem(
          product: product, 
          restaurantName: restaurantName, 
          restaurantAddress: restaurantAddress
        ),
      );
    }
    _saveCart();
    notifyListeners();
  }

  void removeItem(int productId) {
    _items.remove(productId);
    _saveCart();
    notifyListeners();
  }

  void removeSingleItem(int productId) {
    if (!_items.containsKey(productId)) {
      return;
    }
    if (_items[productId]!.quantity > 1) {
      _items.update(
        productId,
        (existingCartItem) => CartItem(
          product: existingCartItem.product,
          quantity: existingCartItem.quantity - 1,
          restaurantName: existingCartItem.restaurantName,
          restaurantAddress: existingCartItem.restaurantAddress,
        ),
      );
    } else {
      _items.remove(productId);
    }
    _saveCart();
    notifyListeners();
  }

  void clear() {
    _items.clear();
    _couponCode = null;
    _discountAmount = 0.0;
    _saveCart();
    notifyListeners();
  }

  Future<void> _saveCart() async {
    final prefs = await SharedPreferences.getInstance();
    final String encodedData = jsonEncode(
      _items.map((key, value) => MapEntry(key.toString(), value.toJson())),
    );
    await prefs.setString('cart_data', encodedData);
  }

  Future<void> _loadCart() async {
    final prefs = await SharedPreferences.getInstance();
    if (!prefs.containsKey('cart_data')) return;

    final String? cartData = prefs.getString('cart_data');
    if (cartData == null) return;

    final Map<String, dynamic> decodedData = jsonDecode(cartData);
    _items = decodedData.map((key, value) => MapEntry(
      int.parse(key),
      CartItem.fromJson(value),
    ));
    notifyListeners();
  }
}
