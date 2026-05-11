import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LocationProvider with ChangeNotifier {
  Map<String, dynamic>? _selectedCity;
  Map<String, dynamic>? _selectedDistrict;

  Map<String, dynamic>? get selectedCity => _selectedCity;
  Map<String, dynamic>? get selectedDistrict => _selectedDistrict;

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    final cityStr = prefs.getString('selected_city');
    final distStr = prefs.getString('selected_district');

    if (cityStr != null) _selectedCity = jsonDecode(cityStr);
    if (distStr != null) _selectedDistrict = jsonDecode(distStr);
    notifyListeners();
  }

  Future<void> setCity(Map<String, dynamic>? city) async {
    _selectedCity = city;
    _selectedDistrict = null; // reset district
    final prefs = await SharedPreferences.getInstance();
    if (city != null) {
      await prefs.setString('selected_city', jsonEncode(city));
    } else {
      await prefs.remove('selected_city');
    }
    await prefs.remove('selected_district');
    notifyListeners();
  }

  Future<void> setDistrict(Map<String, dynamic>? district) async {
    _selectedDistrict = district;
    final prefs = await SharedPreferences.getInstance();
    if (district != null) {
      await prefs.setString('selected_district', jsonEncode(district));
    } else {
      await prefs.remove('selected_district');
    }
    notifyListeners();
  }

  Future<void> clearLocation() async {
    _selectedCity = null;
    _selectedDistrict = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('selected_city');
    await prefs.remove('selected_district');
    notifyListeners();
  }
}
