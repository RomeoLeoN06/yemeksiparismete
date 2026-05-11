import 'dart:convert';
import 'package:http/http.dart' as http;
import 'api_constants.dart';
import 'auth_service.dart';

class UserService {
  final AuthService _authService = AuthService();

  // Addresses
  Future<List<dynamic>> getAddresses() async {
    final token = await _authService.getToken();
    if (token == null) return [];
    
    final response = await http.get(
      Uri.parse('${ApiConstants.baseUrl}/User/addresses'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    return [];
  }

  Future<bool> addAddress(Map<String, dynamic> addressData) async {
    final token = await _authService.getToken();
    final response = await http.post(
      Uri.parse('${ApiConstants.baseUrl}/User/addresses'),
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
      body: jsonEncode(addressData),
    );
    return response.statusCode == 200 || response.statusCode == 201;
  }

  Future<bool> deleteAddress(int id) async {
    final token = await _authService.getToken();
    final response = await http.delete(
      Uri.parse('${ApiConstants.baseUrl}/User/addresses/$id'),
      headers: {'Authorization': 'Bearer $token'},
    );
    return response.statusCode == 200 || response.statusCode == 204;
  }

  // Payment Methods
  Future<List<dynamic>> getPaymentMethods() async {
    final token = await _authService.getToken();
    if (token == null) return [];
    
    final response = await http.get(
      Uri.parse('${ApiConstants.baseUrl}/User/payment-methods'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }
    return [];
  }

  Future<bool> addPaymentMethod(Map<String, dynamic> cardData) async {
    final token = await _authService.getToken();
    final response = await http.post(
      Uri.parse('${ApiConstants.baseUrl}/User/payment-methods'),
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
      body: jsonEncode(cardData),
    );
    return response.statusCode == 200 || response.statusCode == 201;
  }

  Future<bool> deletePaymentMethod(int id) async {
    final token = await _authService.getToken();
    final response = await http.delete(
      Uri.parse('${ApiConstants.baseUrl}/User/payment-methods/$id'),
      headers: {'Authorization': 'Bearer $token'},
    );
    return response.statusCode == 200 || response.statusCode == 204;
  }

  // Change Password
  Future<bool> changePassword(String currentPassword, String newPassword) async {
    final token = await _authService.getToken();
    final response = await http.post(
      Uri.parse('${ApiConstants.baseUrl}/User/change-password'),
      headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer $token'},
      body: jsonEncode({
        'currentPassword': currentPassword,
        'newPassword': newPassword
      }),
    );
    return response.statusCode == 200;
  }
}
