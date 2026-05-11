import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'api_constants.dart';

class AuthService {
  // Login
  Future<Map<String, dynamic>> login(String identifier, String password) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConstants.login),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'identifier': identifier,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final token = data['token'];
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('jwt_token', token);
        await prefs.setString('user_data', jsonEncode(data['user']));
        return {'success': true, 'data': data};
      } else {
        return {'success': false, 'message': 'Giriş başarısız.'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Hata: $e'};
    }
  }

  // Register
  Future<Map<String, dynamic>> register({
    required String fullName,
    required String email,
    required String phoneNumber,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConstants.register),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'fullName': fullName,
          'email': email,
          'phoneNumber': phoneNumber,
          'password': password,
          'role': 'customer',
        }),
      );

      if (response.statusCode == 200) {
        return {'success': true, 'message': 'Kayıt başarılı!'};
      } else {
        try {
          final errorData = jsonDecode(response.body);
          if (errorData is List && errorData.isNotEmpty) {
            return {'success': false, 'message': errorData[0]['description'] ?? 'Kayıt başarısız.'};
          }
          return {'success': false, 'message': errorData['message'] ?? 'Kayıt başarısız.'};
        } catch (_) {
          return {'success': false, 'message': 'Kayıt başarısız. Hata kodu: ${response.statusCode}'};
        }
      }
    } catch (e) {
      return {'success': false, 'message': 'Hata: $e'};
    }
  }

  // Reset Password
  Future<Map<String, dynamic>> resetPassword({
    required String email,
    required String recoveryCode,
    required String newPassword,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}/Auth/reset-password'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'recoveryCode': recoveryCode,
          'newPassword': newPassword,
        }),
      );

      if (response.statusCode == 200) {
        return {'success': true, 'message': 'Şifre başarıyla güncellendi.'};
      } else {
        final data = jsonDecode(response.body);
        return {'success': false, 'message': data['message'] ?? 'İşlem başarısız.'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Hata: $e'};
    }
  }

  // Get Current User
  Future<Map<String, dynamic>> getCurrentUser() async {
    try {
      final token = await getToken();
      if (token == null) return {'success': false};

      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/Auth/me'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token'
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {'success': true, 'data': data['user'] ?? data};
      }
      return {'success': false};
    } catch (e) {
      return {'success': false};
    }
  }

  // Utils
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token');
    await prefs.remove('user_data');
  }

  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('jwt_token');
    return token != null && token.isNotEmpty;
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwt_token');
  }
}
