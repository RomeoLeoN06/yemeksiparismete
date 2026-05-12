import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/courier_service.dart';
import 'login_screen.dart';

class CourierPanelScreen extends StatefulWidget {
  const CourierPanelScreen({super.key});

  @override
  State<CourierPanelScreen> createState() => _CourierPanelScreenState();
}

class _CourierPanelScreenState extends State<CourierPanelScreen> {
  final CourierService _courierService = CourierService();
  Map<String, dynamic>? _stats;
  List<dynamic> _orders = [];
  bool _isLoading = true;
  final TextEditingController _ibanController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    setState(() => _isLoading = true);
    final statsResponse = await _courierService.getStats();
    final ordersResponse = await _courierService.getMyOrders();

    if (mounted) {
      setState(() {
        if (statsResponse['success']) {
          _stats = statsResponse['data'];
          _ibanController.text = _stats?['iban'] ?? '';
        }
        _orders = ordersResponse;
        _isLoading = false;
      });
    }
  }

  Future<void> _updateStatus(int orderId, String status) async {
    final res = await _courierService.updateOrderStatus(orderId, status);
    if (res['success']) {
      _fetchData();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Sipariş durumu güncellendi: $status')),
        );
      }
    }
  }

  Future<void> _updateProfile(bool isActive) async {
    final String cleanIban = _ibanController.text.replaceAll(' ', '');
    final RegExp ibanRegex = RegExp(r'^TR\d{24}$');

    if (!ibanRegex.hasMatch(cleanIban)) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Geçersiz IBAN! TR ile başlayan 26 hane girmelisiniz.'),
            backgroundColor: Colors.red,
          ),
        );
      }
      return;
    }

    final res = await _courierService.updateProfile(cleanIban, isActive);
    if (res['success']) {
      _fetchData();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profil güncellendi')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;
    final activeOrders = _orders.where((o) => o['status'] != 'delivered' && o['status'] != 'cancelled').toList();
    final pastOrders = _orders.where((o) => o['status'] == 'delivered' || o['status'] == 'cancelled').toList().reversed.toList();

    return Scaffold(
      backgroundColor: Colors.grey[900],
      appBar: AppBar(
        title: const Text('Kurye Dashboard', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _fetchData,
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await context.read<AuthProvider>().logout();
              if (mounted) {
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
          ? const Center(child: CircularProgressIndicator(color: Colors.orange))
          : RefreshIndicator(
              onRefresh: _fetchData,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Status Toggle & Welcome
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Hoş geldin,', style: TextStyle(color: Colors.grey[400])),
                            Text(user?['fullName'] ?? 'Kurye', 
                              style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        Switch(
                          value: _stats?['isActive'] ?? false,
                          activeColor: Colors.orange,
                          onChanged: (val) => _updateProfile(val),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),

                    // Stats Cards
                    Row(
                      children: [
                        Expanded(
                          child: _buildStatCard(
                            'Toplam Kazanç', 
                            '${_stats?['totalEarnings']?.toStringAsFixed(2) ?? '0.00'} TL', 
                            Icons.account_balance_wallet,
                            Colors.green,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildStatCard(
                            'Bugün', 
                            '${_stats?['todayEarnings']?.toStringAsFixed(2) ?? '0.00'} TL', 
                            Icons.trending_up,
                            Colors.orange,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),

                    // IBAN Section
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.05),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: Colors.white.withOpacity(0.1)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Ödeme Bilgileri (IBAN)', 
                            style: TextStyle(color: Colors.white70, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Expanded(
                                child: TextField(
                                  controller: _ibanController,
                                  style: const TextStyle(color: Colors.white),
                                  decoration: InputDecoration(
                                    hintText: 'TR00...',
                                    hintStyle: TextStyle(color: Colors.grey[600]),
                                    filled: true,
                                    fillColor: Colors.black26,
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(12),
                                      borderSide: BorderSide.none,
                                    ),
                                    contentPadding: const EdgeInsets.symmetric(horizontal: 16),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              ElevatedButton(
                                onPressed: () => _updateProfile(_stats?['isActive'] ?? false),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.orange,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                ),
                                child: const Text('Kaydet', style: TextStyle(color: Colors.black)),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 32),

                    // Active Orders
                    const Text('Aktif Görevler', 
                      style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 16),
                    if (activeOrders.isEmpty)
                      Center(
                        child: Padding(
                          padding: const EdgeInsets.all(32.0),
                          child: Column(
                            children: [
                              Icon(Icons.bike_scooter, size: 48, color: Colors.grey[700]),
                              const SizedBox(height: 8),
                              Text('Aktif sipariş bulunmuyor', style: TextStyle(color: Colors.grey[600])),
                            ],
                          ),
                        ),
                      )
                    else
                      ...activeOrders.map((order) => _buildOrderCard(order)),

                    const SizedBox(height: 32),
                    // Past Orders Section
                    const Text('Geçmiş Siparişler', 
                      style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 16),
                    if (pastOrders.isEmpty)
                      Center(
                        child: Padding(
                          padding: const EdgeInsets.all(24.0),
                          child: Text('Geçmiş sipariş bulunmuyor', style: TextStyle(color: Colors.grey[600])),
                        ),
                      )
                    else
                      ...pastOrders.take(15).map((order) => _buildPastOrderCard(order)),
                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildPastOrderCard(Map<String, dynamic> order) {
    final bool isDelivered = order['status'] == 'delivered';
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.03),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Sipariş #${order['id']}', 
                style: const TextStyle(color: Colors.grey, fontSize: 11, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Text('${order['totalAmount']} TL', 
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text('+${(order['totalAmount'] * 0.1).toStringAsFixed(2)} TL', 
                style: TextStyle(color: isDelivered ? Colors.green : Colors.red, fontWeight: FontWeight.bold, fontSize: 16)),
              const SizedBox(height: 4),
              Text(isDelivered ? 'TESLİM EDİLDİ' : 'İPTAL EDİLDİ', 
                style: TextStyle(color: isDelivered ? Colors.green.withOpacity(0.5) : Colors.red.withOpacity(0.5), fontSize: 9, fontWeight: FontWeight.bold)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 12),
          Text(label, style: TextStyle(color: color.withOpacity(0.7), fontSize: 12)),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildOrderCard(Map<String, dynamic> order) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Sipariş #${order['id']}', 
            style: const TextStyle(color: Colors.orange, fontWeight: FontWeight.bold, fontSize: 16)),
          const Divider(color: Colors.white10, height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Sipariş Tutarı: ${order['totalAmount']} TL', 
                    style: const TextStyle(color: Colors.grey, fontSize: 12)),
                  const SizedBox(height: 4),
                  Text('Kazancınız: ${(order['totalAmount'] * 0.1).toStringAsFixed(2)} TL', 
                    style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 16)),
                ],
              ),
              const Icon(Icons.trending_up, color: Colors.green, size: 24),
            ],
          ),
          const Divider(color: Colors.white10, height: 24),
          Row(
            children: [
              const Icon(Icons.person, size: 16, color: Colors.grey),
              const SizedBox(width: 8),
              Text(order['customerName'] ?? 'Müşteri', style: const TextStyle(color: Colors.white)),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(Icons.location_on, size: 16, color: Colors.grey),
              const SizedBox(width: 8),
              Expanded(
                child: Text(order['deliveryAddress'] ?? 'Adres yok', 
                  style: const TextStyle(color: Colors.white70, fontSize: 13)),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => _updateStatus(order['id'], 'delivered'),
                  icon: const Icon(Icons.check_circle_outline, size: 18),
                  label: const Text('Teslim Ettim'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              IconButton(
                onPressed: () => _updateStatus(order['id'], 'cancelled'),
                icon: const Icon(Icons.cancel_outlined, color: Colors.red),
                tooltip: 'İptal',
              ),
            ],
          ),
        ],
      ),
    );
  }
}
