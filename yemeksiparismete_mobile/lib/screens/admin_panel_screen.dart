import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/auth_provider.dart';
import '../services/admin_panel_service.dart';
import 'login_screen.dart';

class AdminPanelScreen extends StatefulWidget {
  const AdminPanelScreen({super.key});

  @override
  State<AdminPanelScreen> createState() => _AdminPanelScreenState();
}

class _AdminPanelScreenState extends State<AdminPanelScreen> {
  int _currentIndex = 0;
  final AdminPanelService _service = AdminPanelService();
  
  Map<String, dynamic>? _stats;
  List<dynamic> _courierApps = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    final statsRes = await _service.getStats();
    final courierRes = await _service.getCourierApplications();

    if (mounted) {
      setState(() {
        if (statsRes['success']) _stats = statsRes['data'];
        if (courierRes['success']) _courierApps = courierRes['data'];
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Yönetici Paneli'),
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
              ? _buildStatsTab(theme)
              : _buildCouriersTab(theme),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        selectedItemColor: theme.colorScheme.primary,
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Genel Durum'),
          BottomNavigationBarItem(icon: Icon(Icons.delivery_dining), label: 'Kurye Başvuruları'),
        ],
      ),
    );
  }

  Widget _buildStatsTab(ThemeData theme) {
    if (_stats == null) return const Center(child: Text('Veri bulunamadı.'));

    final recentOrders = _stats!['recentOrders'] as List<dynamic>? ?? [];

    return RefreshIndicator(
      onRefresh: _loadData,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // İstatistik Kartları
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 1.5,
            children: [
              _buildStatCard('Kazanç', '₺${_stats!['monthlyEarnings']}', Colors.green, Icons.attach_money),
              _buildStatCard('Siparişler', '${_stats!['totalOrders']}', Colors.blue, Icons.shopping_bag),
              _buildStatCard('Kullanıcılar', '${_stats!['totalUsers']}', Colors.purple, Icons.people),
              _buildStatCard('Restoranlar', '${_stats!['totalRestaurants']}', Colors.orange, Icons.store),
            ],
          ),
          const SizedBox(height: 24),
          const Text('Son Siparişler', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          
          ...recentOrders.map((order) {
            final date = DateTime.parse(order['orderDate']).toLocal();
            final formattedDate = DateFormat('dd.MM.yyyy HH:mm').format(date);
            return Card(
              margin: const EdgeInsets.only(bottom: 8),
              child: ListTile(
                title: Text('Sipariş #${order['id']} - ₺${order['totalAmount']}'),
                subtitle: Text('${order['customerName']} (${order['customerPhone'] ?? '-'}) • $formattedDate'),
                trailing: Chip(
                  label: Text(_getStatusText(order['status']), style: const TextStyle(color: Colors.white, fontSize: 10)),
                  backgroundColor: _getStatusColor(order['status']),
                ),
              ),
            );
          }).toList(),
        ],
      ),
    );
  }

  Widget _buildStatCard(String title, String value, Color color, IconData icon) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 8),
            Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            Text(title, style: const TextStyle(fontSize: 12, color: Colors.grey)),
          ],
        ),
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

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'preparing': return Colors.blue;
      case 'on_the_way': return Colors.purple;
      case 'delivered': return Colors.green;
      case 'cancelled':
      case 'canceled': return Colors.red;
      default: return Colors.grey;
    }
  }

  Widget _buildCouriersTab(ThemeData theme) {
    if (_courierApps.isEmpty) {
      return const Center(child: Text('Henüz kurye başvurusu yok.'));
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _courierApps.length,
      itemBuilder: (context, index) {
        final app = _courierApps[index];
        final isPending = app['status'] == 'Pending';

        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(app['fullName'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                    Chip(
                      label: Text(app['status'], style: const TextStyle(color: Colors.white, fontSize: 12)),
                      backgroundColor: app['status'] == 'Approved' ? Colors.green : (app['status'] == 'Rejected' ? Colors.red : Colors.orange),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text('Telefon: ${app['phoneNumber']}'),
                Text('Araç Türü: ${app['vehicleType']} • Ehliyet: ${app['driverLicenseType']}'),
                Text('Bölge: ${app['city']} - ${app['district']}'),
                if (app['experienceInfo'] != null && app['experienceInfo'].toString().isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(top: 8.0),
                    child: Text('Deneyim: ${app['experienceInfo']}', style: const TextStyle(fontStyle: FontStyle.italic)),
                  ),
                if (isPending) ...[
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
                          onPressed: () => _updateCourierStatus(app['id'], 'Approved'),
                          child: const Text('Onayla'),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                          onPressed: () => _updateCourierStatus(app['id'], 'Rejected'),
                          child: const Text('Reddet'),
                        ),
                      ),
                    ],
                  ),
                ]
              ],
            ),
          ),
        );
      },
    );
  }

  Future<void> _updateCourierStatus(int id, String newStatus) async {
    final result = await _service.updateCourierStatus(id, newStatus);
    if (result['success']) {
      _loadData();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Durum güncellendi!'), backgroundColor: Colors.green));
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(result['message'] ?? 'Hata oluştu'), backgroundColor: Colors.red));
      }
    }
  }
}
