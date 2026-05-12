import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'api_constants.dart';

class CourierService {
  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwt_token');
  }

  // Get Courier Stats
  Future<Map<String, dynamic>> getStats() async {
    try {
      final token = await _getToken();
      final response = await http.get(
        Uri.parse('${ApiConstants.couriers}/stats'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        return {'success': true, 'data': jsonDecode(response.body)};
      }
      return {'success': false, 'message': 'İstatistikler alınamadı.'};
    } catch (e) {
      return {'success': false, 'message': 'Hata: $e'};
    }
  }

  // Get Courier Orders
  Future<List<dynamic>> getMyOrders() async {
    try {
      final token = await _getToken();
      final response = await http.get(
        Uri.parse('${ApiConstants.couriers}/my-orders'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  // Update Order Status
  Future<Map<String, dynamic>> updateOrderStatus(int orderId, String status) async {
    try {
      final token = await _getToken();
      final response = await http.put(
        Uri.parse('${ApiConstants.couriers}/update-order-status/$orderId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(status),
      );

      if (response.statusCode == 200) {
        return {'success': true, 'message': 'Durum güncellendi.'};
      }
      return {'success': false, 'message': 'Güncelleme başarısız.'};
    } catch (e) {
      return {'success': false, 'message': 'Hata: $e'};
    }
  }

  // Update Courier Profile (IBAN & Active Status)
  Future<Map<String, dynamic>> updateProfile(String iban, bool isActive) async {
    try {
      final token = await _getToken();
      final response = await http.post(
        Uri.parse('${ApiConstants.couriers}/update-profile'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'iban': iban,
          'isActive': isActive,
        }),
      );

      if (response.statusCode == 200) {
        return {'success': true, 'message': 'Profil güncellendi.'};
      }
      return {'success': false, 'message': 'Güncelleme başarısız.'};
    } catch (e) {
      return {'success': false, 'message': 'Hata: $e'};
    }
  }
}
