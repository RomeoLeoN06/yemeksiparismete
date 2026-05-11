import 'dart:convert';
import 'package:http/http.dart' as http;
import 'api_constants.dart';

class CouponService {
  Future<Map<String, dynamic>> validateCoupon(String code) async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/coupons/validate/$code'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        return {
          'success': true,
          'data': jsonDecode(response.body),
        };
      } else {
        final error = jsonDecode(response.body);
        return {
          'success': false,
          'message': error['message'] ?? 'Kupon geçersiz.',
        };
      }
    } catch (e) {
      return {'success': false, 'message': 'Bağlantı hatası: $e'};
    }
  }

  Future<List<dynamic>> getCoupons() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/coupons'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        return [];
      }
    } catch (e) {
      return [];
    }
  }
}
