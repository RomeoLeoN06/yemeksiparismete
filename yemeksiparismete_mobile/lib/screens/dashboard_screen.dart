import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../services/dashboard_service.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final DashboardService _dashboardService = DashboardService();
  Map<String, dynamic>? _stats;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchDashboardData();
  }

  Future<void> _fetchDashboardData() async {
    setState(() => _isLoading = true);
    final stats = await _dashboardService.getStats();
    setState(() {
      _stats = stats;
      _isLoading = false;
    });
  }

  Future<void> _updateStatus(int orderId, String newStatus) async {
    final success = await _dashboardService.updateOrderStatus(orderId, newStatus);
    if (success) {
      _fetchDashboardData();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Sipariş durumu güncellendi.')));
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Durum güncellenirken hata oluştu.'), backgroundColor: Colors.red));
      }
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'preparing':
        return Colors.orange;
      case 'on_the_way':
        return Colors.blue;
      case 'delivered':
        return Colors.green;
      case 'canceled':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  String _getStatusText(String status) {
    switch (status) {
      case 'preparing':
        return 'Hazırlanıyor';
      case 'on_the_way':
        return 'Yolda';
      case 'delivered':
        return 'Teslim Edildi';
      case 'canceled':
        return 'İptal Edildi';
      default:
        return status;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(title: const Text('Yönetim Paneli')),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (_stats == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Yönetim Paneli')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 64, color: Colors.red),
              const SizedBox(height: 16),
              const Text('Veriler alınamadı.'),
              TextButton(onPressed: _fetchDashboardData, child: const Text('Tekrar Dene'))
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('Restoran Yönetim Paneli'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _fetchDashboardData),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _fetchDashboardData,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Stats Grid
              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                mainAxisSpacing: 16,
                crossAxisSpacing: 16,
                childAspectRatio: 1.5,
                children: [
                  _buildStatCard('Toplam Sipariş', '${_stats!['totalOrders']}', Icons.shopping_bag, Colors.blue),
                  _buildStatCard('Aylık Kazanç', '₺${_stats!['monthlyEarnings']}', Icons.trending_up, Colors.green),
                  _buildStatCard('Aktif Menüler', '${_stats!['activeMenus']}', Icons.restaurant_menu, Colors.orange),
                  _buildStatCard('Kullanıcılar', '${_stats!['totalUsers']}', Icons.people, Colors.purple),
                ],
              ),
              const SizedBox(height: 24),
              const Text('Gelen Siparişler', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              
              if ((_stats!['recentOrders'] as List).isEmpty)
                const Center(child: Padding(
                  padding: EdgeInsets.all(32.0),
                  child: Text('Henüz sipariş bulunmuyor.'),
                ))
              else
                ...(_stats!['recentOrders'] as List).map((order) {
                  final date = DateTime.parse(order['orderDate']).toLocal();
                  final isCanceled = order['status'] == 'canceled';
                  return Opacity(
                    opacity: isCanceled ? 0.6 : 1.0,
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(
                      color: theme.cardColor,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(color: theme.shadowColor, blurRadius: 10, offset: const Offset(0, 5))
                      ],
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Sipariş #${order['id']}', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, decoration: isCanceled ? TextDecoration.lineThrough : null)),
                              Text('₺${order['totalAmount']}', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: isCanceled ? Colors.grey : theme.colorScheme.primary, decoration: isCanceled ? TextDecoration.lineThrough : null)),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              const Icon(Icons.access_time, size: 16, color: Colors.grey),
                              const SizedBox(width: 4),
                              Text(DateFormat('dd.MM.yyyy HH:mm').format(date), style: const TextStyle(color: Colors.grey, fontSize: 12)),
                            ],
                          ),
                          const Divider(height: 24),
                          
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Icon(Icons.person, size: 20, color: Colors.grey),
                              const SizedBox(width: 8),
                              Expanded(child: Text(order['customerName'] ?? 'Müşteri', style: const TextStyle(fontWeight: FontWeight.bold))),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Icon(Icons.phone, size: 20, color: Colors.grey),
                              const SizedBox(width: 8),
                              Expanded(child: Text(order['customerPhone'] ?? '-')),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Icon(Icons.location_on, size: 20, color: Colors.grey),
                              const SizedBox(width: 8),
                              Expanded(child: Text(order['deliveryAddress'] ?? 'Adres bilgisi yok', style: const TextStyle(color: Colors.grey))),
                            ],
                          ),
                          
                          const Divider(height: 24),
                          const Text('Sipariş İçeriği:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                          const SizedBox(height: 8),
                          ...(order['items'] as List).map((item) => Padding(
                            padding: const EdgeInsets.only(bottom: 4.0),
                            child: Row(
                              children: [
                                Text('${item['quantity']}x', style: TextStyle(fontWeight: FontWeight.bold, decoration: isCanceled ? TextDecoration.lineThrough : null)),
                                const SizedBox(width: 8),
                                Expanded(child: Text(item['productName'], style: TextStyle(decoration: isCanceled ? TextDecoration.lineThrough : null))),
                                Text('₺${item['price']}', style: TextStyle(color: Colors.grey, decoration: isCanceled ? TextDecoration.lineThrough : null)),
                              ],
                            ),
                          )),
                          
                          const SizedBox(height: 16),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                            decoration: BoxDecoration(
                              color: _getStatusColor(order['status']).withOpacity(0.1),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text('Durum:', style: TextStyle(color: _getStatusColor(order['status']), fontWeight: FontWeight.bold)),
                                DropdownButton<String>(
                                  value: order['status'],
                                  underline: const SizedBox(),
                                  icon: Icon(Icons.arrow_drop_down, color: _getStatusColor(order['status'])),
                                  style: TextStyle(color: _getStatusColor(order['status']), fontWeight: FontWeight.bold),
                                  onChanged: (String? newValue) {
                                    if (newValue != null && newValue != order['status']) {
                                      _updateStatus(order['id'], newValue);
                                    }
                                  },
                                  items: const [
                                    DropdownMenuItem(value: 'preparing', child: Text('Hazırlanıyor')),
                                    DropdownMenuItem(value: 'on_the_way', child: Text('Yolda')),
                                    DropdownMenuItem(value: 'delivered', child: Text('Teslim Edildi')),
                                    DropdownMenuItem(value: 'canceled', child: Text('İptal Edildi')),
                                  ],
                                ),
                              ],
                            ),
                          )
                        ],
                      ),
                    ),
                  ));
                }),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(color: Theme.of(context).shadowColor, blurRadius: 10, offset: const Offset(0, 4))
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 28),
          const Spacer(),
          Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          Text(title, style: const TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
