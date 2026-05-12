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

      // Adminin kullandığı çalışan ve kısıtlamasız endpoint'i kullanalım
      final response = await http.patch(
        Uri.parse('${ApiConstants.orders}/update-status/$orderId/$status'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        return {'success': true, 'message': 'Durum güncellendi.'};
      } else {
        final responseData = json.decode(response.body);
        return {'success': false, 'message': responseData['message'] ?? 'Sipariş durumu güncellenemedi.'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Bağlantı hatası: $e'};
    }
  }

  Future<Map<String, dynamic>> addProduct(Map<String, dynamic> productData) async {
    try {
      final token = await _getToken();
      if (token == null) return {'success': false, 'message': 'Oturum süresi dolmuş.'};

      final response = await http.post(
        Uri.parse('${ApiConstants.restaurantPanel}/my-products'),
        headers: _getHeaders(token),
        body: json.encode(productData),
      );

      if (response.statusCode == 200) {
        return {'success': true, 'data': json.decode(response.body)};
      } else {
        return {'success': false, 'message': 'Ürün eklenemedi.'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Bağlantı hatası: $e'};
    }
  }

  Future<Map<String, dynamic>> updateProduct(int id, Map<String, dynamic> productData) async {
    try {
      final token = await _getToken();
      if (token == null) return {'success': false, 'message': 'Oturum süresi dolmuş.'};

      final response = await http.put(
        Uri.parse('${ApiConstants.restaurantPanel}/my-products/$id'),
        headers: _getHeaders(token),
        body: json.encode(productData),
      );

      if (response.statusCode == 200) {
        return {'success': true, 'data': json.decode(response.body)};
      } else {
        return {'success': false, 'message': 'Ürün güncellenemedi.'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Bağlantı hatası: $e'};
    }
  }

  Future<Map<String, dynamic>> deleteProduct(int id) async {
    try {
      final token = await _getToken();
      if (token == null) return {'success': false, 'message': 'Oturum süresi dolmuş.'};

      final response = await http.delete(
        Uri.parse('${ApiConstants.restaurantPanel}/my-products/$id'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        return {'success': true, 'message': 'Ürün silindi.'};
      } else {
        return {'success': false, 'message': 'Ürün silinemedi.'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Bağlantı hatası: $e'};
    }
  }
}
