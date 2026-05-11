import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'api_constants.dart';

class RestaurantPanelService {
  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwt_token');
  }

  Map<String, String> _getHeaders(String token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  Future<Map<String, dynamic>> getMyRestaurant() async {
    try {
      final token = await _getToken();
      if (token == null) return {'success': false, 'message': 'Oturum süresi dolmuş.'};

      final response = await http.get(
        Uri.parse('${ApiConstants.restaurantPanel}/my-restaurant'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        return {'success': true, 'data': json.decode(response.body)};
      } else {
        return {'success': false, 'message': 'Restoran bilgileri alınamadı.'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Bağlantı hatası: $e'};
    }
  }

  Future<Map<String, dynamic>> getMyOrders() async {
    try {
      final token = await _getToken();
      if (token == null) return {'success': false, 'message': 'Oturum süresi dolmuş.'};
 
      final response = await http.get(
        Uri.parse('${ApiConstants.restaurantPanel}/my-orders'),
        headers: _getHeaders(token),
      );
 
      if (response.statusCode == 200) {
        return {'success': true, 'data': json.decode(response.body)};
      } else {
        return {'success': false, 'message': 'Siparişler alınamadı.'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Bağlantı hatası: $e'};
    }
  }

  Future<Map<String, dynamic>> getMyProducts() async {
    try {
      final token = await _getToken();
      if (token == null) return {'success': false, 'message': 'Oturum süresi dolmuş.'};

      final response = await http.get(
        Uri.parse('${ApiConstants.restaurantPanel}/my-products'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        return {'success': true, 'data': json.decode(response.body)};
      } else {
        return {'success': false, 'message': 'Ürünler alınamadı.'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Bağlantı hatası: $e'};
    }
  }

  Future<Map<String, dynamic>> updateOrderStatus(int orderId, String status) async {
    try {
      final token = await _getToken();
      if (token == null) return {'success': false, 'message': 'Oturum süresi dolmuş.'};

      final response = await http.patch(
        Uri.parse('${ApiConstants.restaurantPanel}/my-orders/$orderId/status?status=$status'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        return {'success': true, 'message': 'Durum güncellendi.'};
      } else {
        return {'success': false, 'message': 'Sipariş durumu güncellenemedi.'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Bağlantı hatası: $e'};
    }
  }
}
