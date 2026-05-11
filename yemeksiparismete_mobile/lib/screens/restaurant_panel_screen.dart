import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/restaurant_panel_service.dart';
import 'login_screen.dart';
import 'package:intl/intl.dart';

class RestaurantPanelScreen extends StatefulWidget {
  const RestaurantPanelScreen({super.key});

  @override
  State<RestaurantPanelScreen> createState() => _RestaurantPanelScreenState();
}

class _RestaurantPanelScreenState extends State<RestaurantPanelScreen> {
  int _currentIndex = 0;
  final RestaurantPanelService _service = RestaurantPanelService();
  
  Map<String, dynamic>? _restaurantData;
  List<dynamic> _orders = [];
  List<dynamic> _products = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    final restRes = await _service.getMyRestaurant();
    final ordersRes = await _service.getMyOrders();
    final productsRes = await _service.getMyProducts();

    if (mounted) {
      setState(() {
        if (restRes['success']) {
          _restaurantData = restRes['data'];
        } else {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(restRes['message'] ?? 'Restoran verisi alınamadı')));
        }
        
        if (ordersRes['success']) _orders = ordersRes['data'];
        if (productsRes['success']) _products = productsRes['data'];
        
        _isLoading = false;
      });
    }
  }

  Future<void> _updateOrderStatus(int orderId, String newStatus) async {
    final result = await _service.updateOrderStatus(orderId, newStatus);
    if (result['success']) {
      _loadData();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Durum güncellendi!'), backgroundColor: Colors.green));
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(result['message']), backgroundColor: Colors.red));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: Text(_restaurantData?['name'] ?? 'Restoran Paneli'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadData,
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await context.read<AuthProvider>().logout();
              if (context.mounted) {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const LoginScreen()),
                );
              }
            },
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _currentIndex == 0
              ? _buildOrdersTab(theme)
              : _buildProductsTab(theme),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        selectedItemColor: theme.colorScheme.primary,
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.receipt_long), label: 'Siparişler'),
          BottomNavigationBarItem(icon: Icon(Icons.fastfood), label: 'Ürünlerim'),
        ],
      ),
    );
  }

  Widget _buildOrdersTab(ThemeData theme) {
    if (_orders.isEmpty) {
      return const Center(child: Text('Henüz sipariş yok.'));
    }

    return RefreshIndicator(
      onRefresh: _loadData,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _orders.length,
        itemBuilder: (context, index) {
          final order = _orders[index];
          final date = DateTime.parse(order['orderDate']).toLocal();
          final formattedDate = DateFormat('dd.MM.yyyy HH:mm').format(date);
          final status = order['status'];

          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Sipariş #${order['id']}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                      _buildStatusChip(_getStatusText(status)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text('Müşteri: ${order['customerName']}'),
                  Text('Telefon: ${order['customerPhone']}'),
                  Text('Adres: ${order['deliveryAddress']}'),
                  if ((order['note'] ?? order['Note'] ?? '') != '')
                    Padding(
                      padding: const EdgeInsets.only(top: 8.0),
                      child: Text('NOT: ${order['note'] ?? order['Note']}', style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 13)),
                    ),
                  const Divider(),
                  ...List.generate(
                    order['items'].length,
                    (i) => Text('${order['items'][i]['quantity']}x ${order['items'][i]['productName']} - ₺${order['items'][i]['price']}'),
                  ),
                  const Divider(),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Toplam:', style: TextStyle(fontWeight: FontWeight.bold)),
                          if ((order['discountAmount'] ?? 0) > 0)
                            Text(
                              'Kupon: ${order['couponCode']} (-₺${order['discountAmount']})',
                              style: const TextStyle(color: Colors.green, fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                        ],
                      ),
                      Text('₺${order['totalAmount']}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.green)),
                    ],
                  ),
                  const SizedBox(height: 16),
                  if (status == 'preparing' || status == 'Hazırlanıyor' || status == 'Bekliyor')
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(backgroundColor: Colors.blue),
                            onPressed: () => _updateOrderStatus(order['id'], 'on_the_way'),
                            child: const Text('Yola Çıkar'),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                            onPressed: () => _updateOrderStatus(order['id'], 'cancelled'),
                            child: const Text('İptal Et'),
                          ),
                        ),
                      ],
                    ),
                  if (status == 'on_the_way' || status == 'Yolda')
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                        onPressed: () => _updateOrderStatus(order['id'], 'delivered'),
                        child: const Text('Teslim Edildi İşaretle'),
                      ),
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  String _getStatusText(String status) {
    switch (status.toLowerCase()) {
      case 'preparing': return 'Hazırlanıyor';
      case 'on_the_way': return 'Yolda';
      case 'delivered': return 'Teslim Edildi';
      case 'cancelled':
      case 'canceled': return 'İptal Edildi';
      default: return status;
    }
  }

  Widget _buildStatusChip(String status) {
    Color color;
    switch (status) {
      case 'Bekliyor':
      case 'Hazırlanıyor': color = Colors.blue; break;
      case 'Yolda': color = Colors.purple; break;
      case 'Teslim Edildi': color = Colors.green; break;
      case 'İptal Edildi': color = Colors.red; break;
      default: color = Colors.grey;
    }
    return Chip(
      label: Text(status, style: const TextStyle(color: Colors.white, fontSize: 12)),
      backgroundColor: color,
    );
  }

  Widget _buildProductsTab(ThemeData theme) {
    if (_products.isEmpty) {
      return const Center(child: Text('Henüz ürün eklenmemiş. Lütfen web panelinden ekleyin.'));
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _products.length,
      itemBuilder: (context, index) {
        final product = _products[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.network(
                product['imageUrl'] ?? 'https://via.placeholder.com/150',
                width: 60, height: 60, fit: BoxFit.cover,
                errorBuilder: (c, e, s) => const Icon(Icons.fastfood, size: 40),
              ),
            ),
            title: Text(product['name'], style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text(product['description'] ?? ''),
            trailing: Text('₺${product['price']}', style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 16)),
          ),
        );
      },
    );
  }
}
