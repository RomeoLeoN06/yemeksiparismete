class ApiConstants {
  // Fiziksel cihaz için bilgisayarın yerel ağ IP'si:
  static const String baseUrl = 'http://10.22.107.60:5101/api';

  // Auth
  static const String login = '$baseUrl/Auth/login';
  static const String register = '$baseUrl/Auth/register';

  // Products & Restaurants
  static const String products = '$baseUrl/Products';
  static const String restaurants = '$baseUrl/Restaurants';
  
  // Orders
  static const String orders = '$baseUrl/Orders';

  // User
  static const String user = '$baseUrl/User';

  // Restaurant Panel
  static const String restaurantPanel = '$baseUrl/RestaurantPanel';

  // Admin Dashboard
  static const String dashboard = '$baseUrl/Dashboard';
  
  // Courier
  static const String couriers = '$baseUrl/Courier';
}
