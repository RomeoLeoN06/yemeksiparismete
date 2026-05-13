import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();
  
  bool _isLoading = false;
  bool _isAuthenticated = false;
  Map<String, dynamic>? _user;

  bool get isLoading => _isLoading;
  bool get isAuthenticated => _isAuthenticated;
  Map<String, dynamic>? get user => _user;
  Future<String?> get token => _authService.getToken();

  AuthProvider() {
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    _isLoading = true;
    notifyListeners();
    
    _isAuthenticated = await _authService.isLoggedIn();
    if (_isAuthenticated) {
      final prefs = await SharedPreferences.getInstance();
      final userDataString = prefs.getString('user_data');
      if (userDataString != null) {
        _user = jsonDecode(userDataString);
      }
    }
    
    _isLoading = false;
    notifyListeners();
  }

  Future<Map<String, dynamic>> login(String identifier, String password) async {
    _isLoading = true;
    notifyListeners();

    final result = await _authService.login(identifier, password);
    
    if (result['success']) {
      _isAuthenticated = true;
      _user = result['data']['user'];
    }
    
    _isLoading = false;
    notifyListeners();
    return result;
  }

  Future<void> logout() async {
    await _authService.logout();
    _isAuthenticated = false;
    _user = null;
    notifyListeners();
  }

  Future<void> refreshUser() async {
    if (!_isAuthenticated) return;
    final result = await _authService.getCurrentUser();
    if (result['success']) {
      _user = result['data'];
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('user_data', jsonEncode(_user));
      notifyListeners();
    }
  }
}
