import 'dart:convert';
import 'package:http/http.dart' as http;
import 'api_constants.dart';

class LocationService {
  Future<List<dynamic>> getCities() async {
    try {
      final response = await http.get(Uri.parse('${ApiConstants.baseUrl}/Cities'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return [];
    } catch (e) {
      print('Error fetching cities: $e');
      return [];
    }
  }

  Future<List<dynamic>> getDistricts(int cityId) async {
    try {
      final response = await http.get(Uri.parse('${ApiConstants.baseUrl}/Cities/$cityId/districts'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return [];
    } catch (e) {
      print('Error fetching districts: $e');
      return [];
    }
  }
}
