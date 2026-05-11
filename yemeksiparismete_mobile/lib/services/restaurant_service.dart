import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/restaurant.dart';
import '../models/product.dart';
import 'api_constants.dart';

class RestaurantService {
  Future<List<Restaurant>> getRestaurants({int? districtId}) async {
    try {
      String url = ApiConstants.restaurants;
      if (districtId != null) {
        url = '$url?districtId=$districtId';
      }
      final response = await http.get(Uri.parse(url));

      if (response.statusCode == 200) {
        print('API Response: ${response.body}');
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Restaurant.fromJson(json)).toList();
      } else {
        print('API Error: ${response.statusCode} - ${response.body}');
        throw Exception('Failed to load restaurants');
      }
    } catch (e) {
      print('Error getting restaurants: $e');
      return [];
    }
  }

  Future<List<Product>> getProductsForRestaurant(int restaurantId) async {
    try {
      final response = await http.get(Uri.parse('${ApiConstants.products}/restaurant/$restaurantId'));

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Product.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load products');
      }
    } catch (e) {
      print('Error getting products: $e');
      return [];
    }
  }
}
