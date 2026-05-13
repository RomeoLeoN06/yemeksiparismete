import 'dart:convert';
import 'package:http/http.dart' as http;
import 'api_constants.dart';
import 'auth_service.dart';
import '../models/cart_item.dart';

class OrderService {
  final AuthService _authService = AuthService();

  Future<Map<String, dynamic>> createOrder({
    required List<CartItem> cartItems, 
    required double totalAmount,
    required String paymentMethod,
    required String customerName,
    required String customerPhone,
    required String deliveryAddress,
    String? note,
    int? restaurantId,
    String? couponCode,
    double discountAmount = 0,
    bool isEcoFriendly = false,
    int? groupOrderSessionId,
    String? targetUserId,
    String? payerUserId,
  }) async {
    try {
      final token = await _authService.getToken();
      if (token == null) return {'success': false, 'message': 'Oturum süresi dolmuş, lütfen tekrar giriş yapın.'};

      final itemsList = cartItems.map((item) => {
        'productId': item.product.id,
        'productName': item.product.name,
        'quantity': item.quantity,
        'price': item.product.price,
        'addedByUserName': item.addedByUserName
      }).toList();

      final response = await http.post(
        Uri.parse(ApiConstants.orders),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'totalAmount': totalAmount,
          'paymentMethod': paymentMethod,
          'customerName': customerName,
          'customerPhone': customerPhone,
          'deliveryAddress': deliveryAddress,
          'note': note,
          'restaurantId': restaurantId,
          'couponCode': couponCode,
          'discountAmount': discountAmount,
          'isEcoFriendly': isEcoFriendly,
          'groupOrderSessionId': groupOrderSessionId,
          'targetUserId': targetUserId,
          'payerUserId': payerUserId,
          'items': itemsList,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return {'success': true, 'message': 'Siparişiniz başarıyla alındı!'};
      } else {
        return {'success': false, 'message': 'Sipariş oluşturulamadı. Hata Kodu: ${response.statusCode}'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Bağlantı hatası: $e'};
    }
  }

  Future<List<dynamic>> getMyOrders() async {
    try {
      final token = await _authService.getToken();
      if (token == null) return [];

      final response = await http.get(
        Uri.parse('${ApiConstants.orders}/my-orders'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        return [];
      }
    } catch (e) {
      print('Error getting orders: $e');
      return [];
    }
  }

  Future<bool> submitRating(int orderId, int score) async {
    try {
      final token = await _authService.getToken();
      if (token == null) return false;

      // baseUrl zaten '/api' içeriyor, bu yüzden direkt ekleme yapıyoruz
      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}/rating/submit'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'orderId': orderId,
          'score': score,
        }),
      );

      print('Rating Response: ${response.statusCode} - ${response.body}');
      return response.statusCode == 200;
    } catch (e) {
      print('Error submitting rating: $e');
      return false;
    }
  }

  Future<bool> cancelOrder(int orderId) async {
    try {
      // Backend'deki AllowAnonymous /api/durum-guncelle endpoint'ini kullanıyoruz
      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/durum-guncelle/$orderId/canceled'),
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Error canceling order: $e');
      return false;
    }
  }
}
