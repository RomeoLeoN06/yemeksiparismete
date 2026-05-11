import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'api_constants.dart';

class AdminPanelService {
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

  Future<Map<String, dynamic>> getStats() async {
    try {
      final token = await _getToken();
      if (token == null) return {'success': false, 'message': 'Oturum süresi dolmuş.'};

      final response = await http.get(
        Uri.parse('${ApiConstants.dashboard}/stats'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        return {'success': true, 'data': json.decode(response.body)};
      } else {
        return {'success': false, 'message': 'İstatistikler alınamadı.'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Bağlantı hatası: $e'};
    }
  }

  Future<Map<String, dynamic>> getCourierApplications() async {
    try {
      final token = await _getToken();
      if (token == null) return {'success': false, 'message': 'Oturum süresi dolmuş.'};

      final response = await http.get(
        Uri.parse('${ApiConstants.couriers}/applications'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        return {'success': true, 'data': json.decode(response.body)};
      } else {
        return {'success': false, 'message': 'Kurye başvuruları alınamadı.'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Bağlantı hatası: $e'};
    }
  }

  Future<Map<String, dynamic>> updateCourierStatus(int id, String status) async {
    try {
      final token = await _getToken();
      if (token == null) return {'success': false, 'message': 'Oturum süresi dolmuş.'};

      final response = await http.put(
        Uri.parse('${ApiConstants.couriers}/applications/$id/status'),
        headers: _getHeaders(token),
        body: json.encode(status),
      );

      if (response.statusCode == 200) {
        return {'success': true};
      } else {
        return {'success': false, 'message': 'Durum güncellenemedi.'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Bağlantı hatası: $e'};
    }
  }
}
