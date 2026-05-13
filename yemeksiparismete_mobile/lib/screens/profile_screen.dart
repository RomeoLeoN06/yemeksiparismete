import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/location_provider.dart';
import '../services/order_service.dart';
import '../services/user_service.dart';
import '../services/location_service.dart';
import 'login_screen.dart';
import 'admin_panel_screen.dart';
import 'restaurant_panel_screen.dart';
import 'courier_application_screen.dart';
import 'courier_panel_screen.dart';
import 'package:intl/intl.dart';
import 'dart:async';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final OrderService _orderService = OrderService();
  final UserService _userService = UserService();
  final LocationService _locationService = LocationService();

  List<dynamic> _orders = [];
  List<dynamic> _addresses = [];
  List<dynamic> _paymentMethods = [];

  bool _isLoadingOrders = true;
  bool _isLoadingAddresses = true;
  bool _isLoadingPayments = true;

  // Forms
  final _addressFormKey = GlobalKey<FormState>();
  bool _showAddAddress = false;
  String _addressTitle = '', _neighborhood = '', _street = '', _buildingNo = '', _floor = '', _apartmentNo = '', _directions = '';
  
  final _cardFormKey = GlobalKey<FormState>();
  bool _showAddCard = false;
  String _cardName = '', _cardNumber = '', _cardExpiry = '';

  final _passwordFormKey = GlobalKey<FormState>();
  String _currentPassword = '', _newPassword = '', _confirmPassword = '';

  List<dynamic> _cities = [];
  List<dynamic> _districts = [];
  int? _selectedCityId;
  int? _selectedDistrictId;

  Timer? _refreshTimer;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
    _tabController.addListener(_handleTabSelection);
    _loadInitialData();
    
    // Her 5 saniyede bir hissettirmeden siparişleri günceller
    _refreshTimer = Timer.periodic(const Duration(seconds: 5), (_) {
      if (mounted && _tabController.index == 1) { // Sadece siparişler sekmesindeyse
        _fetchOrders(silent: true);
      }
    });
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    _tabController.dispose();
    super.dispose();
  }

  void _handleTabSelection() {
    if (_tabController.indexIsChanging) {
      if (_tabController.index == 1) _fetchOrders();
      if (_tabController.index == 2) _fetchAddresses();
      if (_tabController.index == 3) _fetchPaymentMethods();
    }
  }

  Future<void> _loadInitialData() async {
    final cities = await _locationService.getCities();
    setState(() => _cities = cities);
    _fetchOrders(); // load orders initially for default or tab 1
  }

  Future<void> _fetchDistricts(int cityId) async {
    final districts = await _locationService.getDistricts(cityId);
    setState(() {
      _districts = districts;
      _selectedDistrictId = null;
    });
  }

  Future<void> _fetchOrders({bool silent = false}) async {
    if (!silent) setState(() => _isLoadingOrders = true);
    final orders = await _orderService.getMyOrders();
    if (mounted) {
      setState(() {
        _orders = orders;
        _isLoadingOrders = false;
      });
    }
  }

  Future<void> _fetchAddresses() async {
    setState(() => _isLoadingAddresses = true);
    final addresses = await _userService.getAddresses();
    setState(() {
      _addresses = addresses;
      _isLoadingAddresses = false;
    });
  }

  Future<void> _fetchPaymentMethods() async {
    setState(() => _isLoadingPayments = true);
    final cards = await _userService.getPaymentMethods();
    setState(() {
      _paymentMethods = cards;
      _isLoadingPayments = false;
    });
  }

  void _logout(BuildContext context) async {
    final authProvider = context.read<AuthProvider>();
    final locProvider = context.read<LocationProvider>();
    
    await authProvider.logout();
    await locProvider.clearLocation(); // Clear location on logout
    
    if (!context.mounted) return;
    
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (context) => const LoginScreen()),
      (route) => false,
    );
  }

  // Action Handlers
  void _saveAddress() async {
    if (!_addressFormKey.currentState!.validate() || _selectedCityId == null || _selectedDistrictId == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Tüm alanları doldurun')));
      return;
    }
    
    final success = await _userService.addAddress({
      'title': _addressTitle,
      'cityId': _selectedCityId,
      'districtId': _selectedDistrictId,
      'neighborhood': _neighborhood,
      'street': _street,
      'buildingNo': _buildingNo,
      'floor': _floor,
      'apartmentNo': _apartmentNo,
      'directions': _directions,
    });

    if (success) {
      setState(() => _showAddAddress = false);
      _fetchAddresses();
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Adres eklendi')));
    }
  }

  void _saveCard() async {
    if (!_cardFormKey.currentState!.validate()) return;
    final success = await _userService.addPaymentMethod({
      'cardHolderName': _cardName,
      'maskedCardNumber': _cardNumber, // backend expects maskedCardNumber mapped to actual card for now
      'expiryDate': _cardExpiry,
    });
    if (success) {
      setState(() => _showAddCard = false);
      _fetchPaymentMethods();
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Kart eklendi')));
    }
  }

  void _changePassword() async {
    if (!_passwordFormKey.currentState!.validate()) return;
    if (_newPassword != _confirmPassword) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Yeni şifreler uyuşmuyor')));
      return;
    }

    final success = await _userService.changePassword(_currentPassword, _newPassword);
    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Şifre başarıyla güncellendi', style: TextStyle(color: Colors.white)), backgroundColor: Colors.green));
      _passwordFormKey.currentState!.reset();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Mevcut şifre hatalı'), backgroundColor: Colors.red));
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final user = context.watch<AuthProvider>().user;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('Profilim'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => _logout(context),
            tooltip: 'Çıkış Yap',
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: const [
            Tab(icon: Icon(Icons.person), text: 'Hesap'),
            Tab(icon: Icon(Icons.shopping_bag), text: 'Siparişlerim'),
            Tab(icon: Icon(Icons.location_on), text: 'Adreslerim'),
            Tab(icon: Icon(Icons.credit_card), text: 'Ödeme'),
            Tab(icon: Icon(Icons.security), text: 'Güvenlik'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // 1. Hesap Bilgileri
          SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                CircleAvatar(
                  radius: 50,
                  backgroundColor: theme.colorScheme.primary.withOpacity(0.1),
                  child: Icon(Icons.person, size: 50, color: theme.colorScheme.primary),
                ),
                const SizedBox(height: 16),
                Text(user?['fullName'] ?? '', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.green.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: Colors.green.withOpacity(0.2)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.auto_awesome, color: Colors.green, size: 16),
                      const SizedBox(width: 8),
                      Text(
                        '${user?['greenPoints'] ?? user?['GreenPoints'] ?? 0} Yeşil Puan',
                        style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                _buildInfoField('E-Posta Adresi', user?['email'] ?? user?['Email']),
                const SizedBox(height: 16),
                _buildInfoField('Telefon Numarası', user?['phoneNumber'] ?? user?['PhoneNumber'] ?? 'Belirtilmedi'),
                Builder(
                  builder: (context) {
                    final role = (user?['role'] ?? user?['Role'])?.toString().toLowerCase();
                    if (role == 'admin' || role == 'restaurant_owner') {
                      return Padding(
                        padding: const EdgeInsets.only(top: 24.0),
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: theme.colorScheme.primary,
                            foregroundColor: Colors.white,
                            minimumSize: const Size.fromHeight(50),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          onPressed: () {
                            if (role == 'admin') {
                              Navigator.push(context, MaterialPageRoute(builder: (_) => const AdminPanelScreen()));
                            } else {
                              Navigator.push(context, MaterialPageRoute(builder: (_) => const RestaurantPanelScreen()));
                            }
                          },
                          icon: const Icon(Icons.dashboard),
                          label: Text(
                            role == 'admin' ? 'Yönetici Paneli' : 'Restoran Paneli',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                          ),
                        ),
                      );
                    } else if (role == 'courier') {
                      return Padding(
                        padding: const EdgeInsets.only(top: 24.0),
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blueAccent,
                            foregroundColor: Colors.white,
                            minimumSize: const Size.fromHeight(50),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          onPressed: () {
                            Navigator.push(context, MaterialPageRoute(builder: (_) => const CourierPanelScreen()));
                          },
                          icon: const Icon(Icons.bike_scooter),
                          label: const Text('Kurye Dashboard', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        ),
                      );
                    } else if (role == 'customer') {
                      return Padding(
                        padding: const EdgeInsets.only(top: 24.0),
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.orange,
                            foregroundColor: Colors.white,
                            minimumSize: const Size.fromHeight(50),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          onPressed: () {
                            Navigator.push(context, MaterialPageRoute(builder: (_) => const CourierApplicationScreen()));
                          },
                          icon: const Icon(Icons.delivery_dining),
                          label: const Text('Kurye Ol', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        ),
                      );
                    }
                    return const SizedBox.shrink();
                  },
                ),
              ],
            ),
          ),

          // 2. Sipariş Geçmişi
          _isLoadingOrders 
            ? const Center(child: CircularProgressIndicator())
            : _orders.isEmpty 
              ? _buildEmptyState(Icons.inventory_2, 'Henüz siparişiniz yok')
              : RefreshIndicator(
                  onRefresh: _fetchOrders,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _orders.length,
                    itemBuilder: (context, index) {
                    final order = _orders[index];
                    final date = DateTime.parse(order['orderDate']);
                    final isCanceled = (order['status'] == 'cancelled' || order['status'] == 'canceled');
                    return Opacity(
                      opacity: isCanceled ? 0.6 : 1.0,
                      child: Card(
                        margin: const EdgeInsets.only(bottom: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        child: ExpansionTile(
                          title: Row(
                            children: [
                              Expanded(child: Text(order['restaurantName'] ?? 'Bilinmeyen Restoran', style: TextStyle(fontWeight: FontWeight.bold, decoration: isCanceled ? TextDecoration.lineThrough : null))),
                            if (order['ratingScore'] != null)
                              Row(
                                children: [
                                  const Icon(Icons.star, color: Colors.amber, size: 16),
                                  Text('${order['ratingScore']}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                                ],
                              ),
                          ],
                        ),
                        subtitle: Text('${DateFormat('dd.MM.yyyy HH:mm').format(date.toLocal())} - #${order['id']}', style: TextStyle(decoration: isCanceled ? TextDecoration.lineThrough : null)),
                        trailing: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text('${order['totalAmount']} TL', style: TextStyle(color: isCanceled ? Colors.grey : theme.colorScheme.primary, fontWeight: FontWeight.bold, decoration: isCanceled ? TextDecoration.lineThrough : null)),
                            if ((order['discountAmount'] ?? 0) > 0)
                              Text(
                                '-${order['discountAmount']} TL İndirim',
                                style: const TextStyle(color: Colors.green, fontSize: 10, fontWeight: FontWeight.bold),
                              ),
                              Text(
                                isCanceled ? 'İptal Edildi' : (order['status'] == 'delivered' ? 'Teslim Edildi' : (order['status'] == 'on_the_way' ? 'Yolda' : 'Hazırlanıyor')),
                                style: TextStyle(color: isCanceled ? Colors.red : (order['status'] == 'delivered' ? Colors.green : (order['status'] == 'on_the_way' ? Colors.blue : Colors.orange)), fontSize: 12, fontWeight: FontWeight.bold),
                              ),
                          ],
                        ),
                        children: [
                          const Divider(),
                          if (order['status'] == 'delivered' && order['ratingScore'] == null)
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text('Siparişi Puanla:', style: TextStyle(fontWeight: FontWeight.bold)),
                                  Row(
                                    children: List.generate(5, (index) {
                                      return IconButton(
                                        padding: EdgeInsets.zero,
                                        constraints: const BoxConstraints(),
                                        icon: const Icon(Icons.star_border, color: Colors.amber),
                                        onPressed: () async {
                                          final success = await _orderService.submitRating(order['id'], index + 1);
                                          if (success) {
                                            _fetchOrders();
                                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Puanınız iletildi, teşekkürler!')));
                                          }
                                        },
                                      );
                                    }),
                                  ),
                                ],
                              ),
                            ),
                          ...order['items'].map<Widget>((item) => ListTile(
                                dense: true,
                                title: Text('${item['quantity']}x ${item['productName']}', style: TextStyle(decoration: isCanceled ? TextDecoration.lineThrough : null, color: isCanceled ? Colors.grey : null)),
                                trailing: Text('${item['price']} TL', style: TextStyle(decoration: isCanceled ? TextDecoration.lineThrough : null, color: isCanceled ? Colors.grey : null)),
                              )).toList(),
                          if ((order['note'] ?? order['Note'] ?? '') != '')
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                              child: Container(
                                padding: const EdgeInsets.all(12),
                                width: double.infinity,
                                decoration: BoxDecoration(color: Colors.orange.withOpacity(0.1), borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.orange.withOpacity(0.2))),
                                child: Text('Sipariş Notu: ${order['note'] ?? order['Note']}', style: const TextStyle(color: Colors.orange, fontSize: 12, fontWeight: FontWeight.bold)),
                              ),
                            ),
                          if (order['status'] == 'preparing')
                            Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: ElevatedButton.icon(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.red.withOpacity(0.1),
                                  foregroundColor: Colors.red,
                                  elevation: 0,
                                  minimumSize: const Size.fromHeight(45),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12), 
                                    side: const BorderSide(color: Colors.red, width: 1)
                                  ),
                                ),
                                icon: const Icon(Icons.cancel_outlined),
                                label: const Text('Siparişimi İptal Etmek İstiyorum', style: TextStyle(fontWeight: FontWeight.bold)),
                                onPressed: () {
                                  showDialog(
                                    context: context,
                                    builder: (context) => AlertDialog(
                                      title: const Text('Emin Misiniz?'),
                                      content: const Text('Siparişiniz iptal edilecek. Bu işlem geri alınamaz.'),
                                      actions: [
                                        TextButton(onPressed: () => Navigator.pop(context), child: const Text('Vazgeç')),
                                        TextButton(
                                          onPressed: () async {
                                            Navigator.pop(context);
                                            final success = await _orderService.cancelOrder(order['id']);
                                            if (success) {
                                              _fetchOrders();
                                              if (mounted) {
                                                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                                                  content: Text('Siparişiniz iptal edildi.', style: TextStyle(color: Colors.white)), 
                                                  backgroundColor: Colors.red
                                                ));
                                              }
                                            }
                                          }, 
                                          child: const Text('İptal Et', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
                                        ),
                                      ],
                                    ),
                                  );
                                },
                              ),
                            ),
                        ],
                      ),
                    ));
                  },
                )),

          // 3. Adreslerim
          SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (!_showAddAddress)
                  ElevatedButton.icon(
                    onPressed: () => setState(() => _showAddAddress = true),
                    icon: const Icon(Icons.add),
                    label: const Text('Yeni Adres Ekle'),
                    style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(50)),
                  ),
                if (_showAddAddress)
                  Card(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Form(
                        key: _addressFormKey,
                        child: Column(
                          children: [
                            const Text('Yeni Adres Ekle', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 16),
                            TextFormField(decoration: const InputDecoration(labelText: 'Adres Başlığı (Örn: Ev)'), validator: (v) => v!.isEmpty ? 'Zorunlu' : null, onChanged: (v) => _addressTitle = v),
                            DropdownButtonFormField<int>(
                              decoration: const InputDecoration(labelText: 'İl'),
                              items: _cities.map((city) => DropdownMenuItem<int>(value: city['id'], child: Text(city['name']))).toList(),
                              onChanged: (val) {
                                setState(() {
                                  _selectedCityId = val;
                                  _fetchDistricts(val!);
                                });
                              },
                            ),
                            DropdownButtonFormField<int>(
                              decoration: const InputDecoration(labelText: 'İlçe'),
                              value: _selectedDistrictId,
                              items: _districts.map((district) => DropdownMenuItem<int>(value: district['id'], child: Text(district['name']))).toList(),
                              onChanged: (val) => setState(() => _selectedDistrictId = val),
                            ),
                            TextFormField(decoration: const InputDecoration(labelText: 'Mahalle'), validator: (v) => v!.isEmpty ? 'Zorunlu' : null, onChanged: (v) => _neighborhood = v),
                            TextFormField(decoration: const InputDecoration(labelText: 'Sokak / Cadde'), validator: (v) => v!.isEmpty ? 'Zorunlu' : null, onChanged: (v) => _street = v),
                            Row(
                              children: [
                                Expanded(child: TextFormField(decoration: const InputDecoration(labelText: 'Bina No'), validator: (v) => v!.isEmpty ? 'Zorunlu' : null, onChanged: (v) => _buildingNo = v)),
                                const SizedBox(width: 8),
                                Expanded(child: TextFormField(decoration: const InputDecoration(labelText: 'Kat'), validator: (v) => v!.isEmpty ? 'Zorunlu' : null, onChanged: (v) => _floor = v)),
                                const SizedBox(width: 8),
                                Expanded(child: TextFormField(decoration: const InputDecoration(labelText: 'Daire'), validator: (v) => v!.isEmpty ? 'Zorunlu' : null, onChanged: (v) => _apartmentNo = v)),
                              ],
                            ),
                            TextFormField(decoration: const InputDecoration(labelText: 'Tarif (Opsiyonel)'), onChanged: (v) => _directions = v),
                            const SizedBox(height: 16),
                            Row(
                              children: [
                                Expanded(child: TextButton(onPressed: () => setState(() => _showAddAddress = false), child: const Text('İptal'))),
                                Expanded(child: ElevatedButton(onPressed: _saveAddress, child: const Text('Kaydet'))),
                              ],
                            )
                          ],
                        ),
                      ),
                    ),
                  ),
                const SizedBox(height: 24),
                if (_isLoadingAddresses)
                  const Center(child: CircularProgressIndicator())
                else if (_addresses.isEmpty)
                  _buildEmptyState(Icons.map, 'Kayıtlı adresiniz yok.')
                else
                  ..._addresses.map((addr) => Card(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    margin: const EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      leading: const Icon(Icons.location_on),
                      title: Text(addr['title'], style: const TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text('${addr['neighborhood']} Mah. ${addr['street']} Sk. No:${addr['buildingNo']}\n${addr['district']['name']} / ${addr['city']['name']}'),
                      trailing: IconButton(
                        icon: const Icon(Icons.delete, color: Colors.red),
                        onPressed: () async {
                          await _userService.deleteAddress(addr['id']);
                          _fetchAddresses();
                        },
                      ),
                    ),
                  )),
              ],
            ),
          ),

          // 4. Ödeme Yöntemleri
          SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (!_showAddCard)
                  ElevatedButton.icon(
                    onPressed: () => setState(() => _showAddCard = true),
                    icon: const Icon(Icons.add),
                    label: const Text('Yeni Kart Ekle'),
                    style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(50)),
                  ),
                if (_showAddCard)
                  Card(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Form(
                        key: _cardFormKey,
                        child: Column(
                          children: [
                            const Text('Yeni Kart Ekle', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 16),
                            TextFormField(decoration: const InputDecoration(labelText: 'Kart Üzerindeki İsim'), validator: (v) => v!.isEmpty ? 'Zorunlu' : null, onChanged: (v) => _cardName = v),
                            TextFormField(decoration: const InputDecoration(labelText: 'Kart Numarası'), keyboardType: TextInputType.number, maxLength: 16, validator: (v) => v!.length < 16 ? 'Eksik numara' : null, onChanged: (v) => _cardNumber = v),
                            TextFormField(decoration: const InputDecoration(labelText: 'S.K.T (AA/YY)'), validator: (v) => v!.isEmpty ? 'Zorunlu' : null, onChanged: (v) => _cardExpiry = v),
                            const SizedBox(height: 16),
                            Row(
                              children: [
                                Expanded(child: TextButton(onPressed: () => setState(() => _showAddCard = false), child: const Text('İptal'))),
                                Expanded(child: ElevatedButton(onPressed: _saveCard, child: const Text('Kaydet'))),
                              ],
                            )
                          ],
                        ),
                      ),
                    ),
                  ),
                const SizedBox(height: 24),
                if (_isLoadingPayments)
                  const Center(child: CircularProgressIndicator())
                else if (_paymentMethods.isEmpty)
                  _buildEmptyState(Icons.credit_card, 'Kayıtlı kartınız yok.')
                else
                  ..._paymentMethods.map((card) => Card(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    margin: const EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      leading: const Icon(Icons.credit_card),
                      title: Text(card['cardHolderName'], style: const TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text(card['maskedCardNumber']),
                      trailing: IconButton(
                        icon: const Icon(Icons.delete, color: Colors.red),
                        onPressed: () async {
                          await _userService.deletePaymentMethod(card['id']);
                          _fetchPaymentMethods();
                        },
                      ),
                    ),
                  )),
              ],
            ),
          ),

          // 5. Güvenlik
          SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Recovery Code Section
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primary.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: theme.colorScheme.primary.withOpacity(0.2), width: 2),
                  ),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Icon(Icons.shield, color: theme.colorScheme.primary),
                          const SizedBox(width: 12),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Hesap Kurtarma Kodu', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                Text('Şifrenizi unutursanız bu kodu kullanın.', style: TextStyle(fontSize: 12, color: Colors.grey)),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 20),
                        decoration: BoxDecoration(
                          color: Colors.black,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.white12),
                        ),
                        child: Text(
                          user?['recoveryCode'] ?? user?['RecoveryCode'] ?? '------',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 8,
                            color: theme.colorScheme.primary,
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        '⚠️ Bu kodu güvenli bir yerde saklayın.',
                        style: TextStyle(color: Colors.red, fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),
                Form(
                  key: _passwordFormKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Şifre Değiştir', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 24),
                      TextFormField(
                        obscureText: true,
                        decoration: const InputDecoration(labelText: 'Mevcut Şifre', border: OutlineInputBorder()),
                        validator: (v) => v!.isEmpty ? 'Zorunlu' : null,
                        onChanged: (v) => _currentPassword = v,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        obscureText: true,
                        decoration: const InputDecoration(labelText: 'Yeni Şifre', border: OutlineInputBorder()),
                        validator: (v) {
                          if (v == null || v.isEmpty) return 'Şifre giriniz';
                          if (v.length < 8) return 'Şifre en az 8 karakter olmalı';
                          if (!RegExp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.!@#$%^&*()_+={}\[\]:;<>?/-])').hasMatch(v)) {
                            return 'Büyük/küçük harf, rakam ve özel karakter (.!_ vb.) içermelidir';
                          }
                          return null;
                        },
                        onChanged: (v) => _newPassword = v,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        obscureText: true,
                        decoration: const InputDecoration(labelText: 'Yeni Şifre (Tekrar)', border: OutlineInputBorder()),
                        validator: (v) => v!.isEmpty ? 'Zorunlu' : null,
                        onChanged: (v) => _confirmPassword = v,
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: _changePassword,
                        style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(50)),
                        child: const Text('ŞİFREYİ GÜNCELLE'),
                      )
                    ],
                  ),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildInfoField(String label, String? value) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Theme.of(context).cardColor, borderRadius: BorderRadius.circular(12)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(value ?? '', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildEmptyState(IconData icon, String message) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 64, color: Colors.grey[400]),
          const SizedBox(height: 16),
          Text(message, style: TextStyle(fontSize: 16, color: Colors.grey[600], fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
