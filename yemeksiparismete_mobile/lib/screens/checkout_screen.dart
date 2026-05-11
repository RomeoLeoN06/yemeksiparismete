import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cart_provider.dart';
import '../providers/location_provider.dart';
import '../providers/auth_provider.dart';
import '../services/order_service.dart';
import '../services/user_service.dart';
import '../services/location_service.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final UserService _userService = UserService();
  final OrderService _orderService = OrderService();
  final LocationService _locationService = LocationService();

  bool _isLoading = false;
  String _paymentMethod = 'credit_card'; // or 'cash'
  bool _agreeToTerms = false;

  List<dynamic> _addresses = [];
  List<dynamic> _paymentMethods = [];
  int? _selectedAddressId;
  int? _selectedCardId;

  // New Address Form Data
  bool _showNewAddressForm = false;
  final _addressFormKey = GlobalKey<FormState>();
  String _addressTitle = '', _neighborhood = '', _street = '', _buildingNo = '', _floor = '', _apartmentNo = '', _directions = '';
  String _orderNote = '';
  
  List<dynamic> _cities = [];
  List<dynamic> _districts = [];
  int? _selectedCityId;
  int? _selectedDistrictId;

  // New Card Form Data
  bool _showNewCardForm = false;
  final _cardFormKey = GlobalKey<FormState>();
  String _cardName = '', _cardNumber = '', _cardExpiry = '';

  @override
  void initState() {
    super.initState();
    _fetchUserData();
  }

  Future<void> _fetchUserData() async {
    final addresses = await _userService.getAddresses();
    final paymentMethods = await _userService.getPaymentMethods();
    final cities = await _locationService.getCities();
    
    if (mounted) {
      setState(() {
        _cities = cities;
        _addresses = addresses;
        _paymentMethods = paymentMethods;
        
        if (addresses.isNotEmpty) {
          _selectedAddressId = addresses[0]['id'];
          _showNewAddressForm = false;
        } else {
          _selectedAddressId = null;
          _showNewAddressForm = true;
        }
        
        if (paymentMethods.isNotEmpty) _selectedCardId = paymentMethods[0]['id'];
      });
    }
  }

  Future<void> _fetchDistricts(int cityId) async {
    final districts = await _locationService.getDistricts(cityId);
    setState(() {
      _districts = districts;
      _selectedDistrictId = null;
    });
  }

  Future<void> _handleCheckout(CartProvider cart) async {
    if (!_showNewAddressForm && _selectedAddressId == null) {
      _showError('Lütfen bir teslimat adresi seçin veya ekleyin.');
      return;
    }
    if (_showNewAddressForm && (_addressFormKey.currentState == null || !_addressFormKey.currentState!.validate())) {
      _showError('Lütfen adres formunu eksiksiz doldurun.');
      return;
    }
    if (_paymentMethod == 'credit_card' && _selectedCardId == null && !_showNewCardForm) {
      _showError('Lütfen bir kredi kartı seçin veya bilgilerinizi girin.');
      return;
    }
    if (_paymentMethod == 'credit_card' && _showNewCardForm && !_cardFormKey.currentState!.validate()) {
      return;
    }
    if (!_agreeToTerms) {
      _showError('Lütfen mesafeli satış sözleşmesini onaylayın.');
      return;
    }

    setState(() => _isLoading = true);

    // Save new address if form is shown
    if (_showNewAddressForm) {
      final locProvider = context.read<LocationProvider>();
      final success = await _userService.addAddress({
        'title': _addressTitle,
        'cityId': locProvider.selectedCity?['id'],
        'districtId': locProvider.selectedDistrict?['id'],
        'neighborhood': _neighborhood,
        'street': _street,
        'buildingNo': _buildingNo,
        'floor': _floor,
        'apartmentNo': _apartmentNo,
        'directions': _directions,
      });
      if (!success) {
        setState(() => _isLoading = false);
        _showError('Adres kaydedilemedi.');
        return;
      }
    }

    // Save new card if form is shown
    if (_paymentMethod == 'credit_card' && _showNewCardForm) {
      final success = await _userService.addPaymentMethod({
        'cardHolderName': _cardName,
        'maskedCardNumber': _cardNumber,
        'expiryDate': _cardExpiry,
      });
      if (!success) {
        setState(() => _isLoading = false);
        _showError('Kart kaydedilemedi.');
        return;
      }
    }

    // Build delivery address string
    String finalDeliveryAddress = '';
    if (_selectedAddressId != null) {
      final addr = _addresses.firstWhere((a) => a['id'] == _selectedAddressId);
      finalDeliveryAddress = '${addr['neighborhood']} Mah. ${addr['street']} Sk. No:${addr['buildingNo']} Kat:${addr['floor']} Daire:${addr['apartmentNo']}, ${addr['district']['name']} / ${addr['city']['name']}';
    } else {
      final locProvider = context.read<LocationProvider>();
      finalDeliveryAddress = '$_neighborhood Mah. $_street Sk. No:$_buildingNo Kat:$_floor Daire:$_apartmentNo, ${locProvider.selectedDistrict?['name']} / ${locProvider.selectedCity?['name']}';
    }

    if (!mounted) return;
    
    // Process order
    final authProvider = context.read<AuthProvider>();
    final result = await _orderService.createOrder(
      cartItems: cart.items.values.toList(),
      totalAmount: cart.finalAmount,
      couponCode: cart.couponCode,
      discountAmount: cart.discountAmount,
      paymentMethod: _paymentMethod == 'credit_card' ? 'credit_card' : 'cash_at_door',
      customerName: authProvider.user?['fullName'] ?? 'Müşteri',
      customerPhone: authProvider.user?['phoneNumber'] ?? '-',
      deliveryAddress: finalDeliveryAddress,
      note: _orderNote,
      restaurantId: cart.items.isNotEmpty ? cart.items.values.first.product.restaurantId : null,
    );

    setState(() => _isLoading = false);

    if (!mounted) return;

    if (result['success']) {
      cart.clear();
      _showSuccessDialog();
    } else {
      _showError(result['message'] ?? 'Sipariş tamamlanamadı.');
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message), backgroundColor: Colors.red));
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.check_circle, color: Colors.green, size: 80),
            const SizedBox(height: 16),
            const Text('Siparişiniz Alındı!', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text('Harika seçim! Siparişiniz restoranımıza ulaştı.', textAlign: TextAlign.center),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).popUntil((route) => route.isFirst);
              },
              style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(50)),
              child: const Text('Ana Sayfaya Dön'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();
    final locProvider = context.read<LocationProvider>();
    final theme = Theme.of(context);

    if (cart.items.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text('Ödeme')),
        body: const Center(child: Text('Sepetiniz boş.')),
      );
    }

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(title: const Text('Güvenli Ödeme')),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 1. Adres Seçimi
                  _buildSectionHeader('1', 'Teslimat Adresi'),
                  Card(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (_addresses.isNotEmpty) ...[
                            ..._addresses.map((addr) => RadioListTile<int>(
                                  title: Text(addr['title']),
                                  subtitle: Text('${addr['neighborhood']} Mah. ${addr['street']} Sk. ${addr['district']['name']}/${addr['city']['name']}'),
                                  value: addr['id'],
                                  groupValue: _selectedAddressId,
                                  onChanged: (val) => setState(() {
                                    _selectedAddressId = val;
                                    _showNewAddressForm = false;
                                  }),
                                )),
                          ],
                          RadioListTile<int?>(
                            title: const Text('Yeni Adres Gir'),
                            value: null,
                            groupValue: _showNewAddressForm ? null : _selectedAddressId,
                            onChanged: (val) => setState(() {
                              _selectedAddressId = null;
                              _showNewAddressForm = true;
                            }),
                          ),
                          if (_showNewAddressForm || _addresses.isEmpty) ...[
                            const SizedBox(height: 10),
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(color: theme.cardColor, borderRadius: BorderRadius.circular(12)),
                              child: Form(
                                key: _addressFormKey,
                                child: Column(
                                  children: [
                                    TextFormField(decoration: const InputDecoration(labelText: 'Adres Başlığı (Ev, İş)'), validator: (v) => v!.isEmpty ? 'Zorunlu' : null, onChanged: (v) => _addressTitle = v),
                                    const SizedBox(height: 12),
                                    Container(
                                      padding: const EdgeInsets.all(12),
                                      width: double.infinity,
                                      decoration: BoxDecoration(color: theme.scaffoldBackgroundColor, borderRadius: BorderRadius.circular(8), border: Border.all(color: Colors.grey[800]!)),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          const Text('Teslimat Bölgesi', style: TextStyle(fontSize: 12, color: Colors.grey)),
                                          const SizedBox(height: 4),
                                          Text('${locProvider.selectedDistrict?['name'] ?? ''}, ${locProvider.selectedCity?['name'] ?? ''}', style: const TextStyle(fontWeight: FontWeight.bold)),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(height: 12),
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
                                    TextFormField(decoration: const InputDecoration(labelText: 'Adres Tarifi (İsteğe Bağlı)'), onChanged: (v) => _directions = v),
                                  ],
                                ),
                              ),
                            )
                          ]
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // 2. Ödeme Yöntemi
                  _buildSectionHeader('2', 'Ödeme Yöntemi'),
                  Card(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: GestureDetector(
                                  onTap: () => setState(() => _paymentMethod = 'credit_card'),
                                  child: Container(
                                    padding: const EdgeInsets.all(16),
                                    decoration: BoxDecoration(
                                      border: Border.all(color: _paymentMethod == 'credit_card' ? theme.colorScheme.primary : Colors.grey[800]!),
                                      borderRadius: BorderRadius.circular(12),
                                      color: _paymentMethod == 'credit_card' ? theme.colorScheme.primary.withOpacity(0.05) : theme.scaffoldBackgroundColor,
                                    ),
                                    child: const Column(children: [Icon(Icons.credit_card), SizedBox(height: 8), Text('Kredi Kartı')]),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: GestureDetector(
                                  onTap: () => setState(() => _paymentMethod = 'cash'),
                                  child: Container(
                                    padding: const EdgeInsets.all(16),
                                    decoration: BoxDecoration(
                                      border: Border.all(color: _paymentMethod == 'cash' ? theme.colorScheme.primary : Colors.grey[800]!),
                                      borderRadius: BorderRadius.circular(12),
                                      color: _paymentMethod == 'cash' ? theme.colorScheme.primary.withOpacity(0.05) : theme.scaffoldBackgroundColor,
                                    ),
                                    child: const Column(children: [Icon(Icons.money), SizedBox(height: 8), Text('Kapıda Ödeme')]),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          if (_paymentMethod == 'credit_card') ...[
                            const SizedBox(height: 16),
                            const Divider(),
                            if (_paymentMethods.isNotEmpty) ...[
                              ..._paymentMethods.map((card) => RadioListTile<int>(
                                    title: Text(card['maskedCardNumber']),
                                    subtitle: Text(card['cardHolderName']),
                                    value: card['id'],
                                    groupValue: _selectedCardId,
                                    onChanged: (val) => setState(() {
                                      _selectedCardId = val;
                                      _showNewCardForm = false;
                                    }),
                                  )),
                            ],
                            RadioListTile<int?>(
                              title: const Text('Yeni Kart Gir'),
                              value: null,
                              groupValue: _showNewCardForm ? null : _selectedCardId,
                              onChanged: (val) => setState(() {
                                _selectedCardId = null;
                                _showNewCardForm = true;
                              }),
                            ),
                            if (_showNewCardForm || _paymentMethods.isEmpty) ...[
                              const SizedBox(height: 10),
                              Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(color: theme.cardColor, borderRadius: BorderRadius.circular(12)),
                                child: Form(
                                  key: _cardFormKey,
                                  child: Column(
                                    children: [
                                      TextFormField(decoration: const InputDecoration(labelText: 'Kart Üzerindeki İsim'), validator: (v) => v!.isEmpty ? 'Zorunlu' : null, onChanged: (v) => _cardName = v),
                                      TextFormField(decoration: const InputDecoration(labelText: 'Kart Numarası'), keyboardType: TextInputType.number, maxLength: 16, validator: (v) => v!.length < 16 ? 'Geçersiz' : null, onChanged: (v) => _cardNumber = v),
                                      Row(
                                        children: [
                                          Expanded(child: TextFormField(decoration: const InputDecoration(labelText: 'S.K.T (AA/YY)'), validator: (v) => v!.isEmpty ? 'Zorunlu' : null, onChanged: (v) => _cardExpiry = v)),
                                          const SizedBox(width: 8),
                                          Expanded(child: TextFormField(decoration: const InputDecoration(labelText: 'CVV'), obscureText: true, maxLength: 3, validator: (v) => v!.length < 3 ? 'Geçersiz' : null)),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              )
                            ]
                          ]
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // 3. Sipariş Notu
                  _buildSectionHeader('3', 'Sipariş Notu'),
                  Card(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: TextFormField(
                        decoration: const InputDecoration(
                          hintText: 'Zil çalmasın, kapıya asın vb.',
                          border: InputBorder.none,
                        ),
                        maxLines: 3,
                        onChanged: (v) => _orderNote = v,
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Sipariş Özeti
                  Card(
                    color: theme.colorScheme.primary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Sipariş Özeti', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                          const Divider(color: Colors.white30),
                          ...cart.items.values.map((item) => Padding(
                                padding: const EdgeInsets.symmetric(vertical: 4.0),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text('${item.quantity}x ${item.product.name}', style: const TextStyle(color: Colors.white70)),
                                    Text('${item.product.price * item.quantity} TL', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                  ],
                                ),
                              )),
                          const Divider(color: Colors.white30),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Ara Toplam', style: TextStyle(color: Colors.white70, fontSize: 16)),
                              Text('${cart.totalAmount.toStringAsFixed(2)} TL', style: const TextStyle(color: Colors.white, fontSize: 16)),
                            ],
                          ),
                          if (cart.discountAmount > 0)
                            Padding(
                              padding: const EdgeInsets.only(top: 8),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text('Kupon İndirimi (${cart.couponCode})', style: const TextStyle(color: Colors.white70, fontSize: 16)),
                                  Text('-${cart.discountAmount.toStringAsFixed(2)} TL', style: const TextStyle(color: Colors.greenAccent, fontSize: 16, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                          const Divider(color: Colors.white30),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Toplam', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                              Text('${cart.finalAmount.toStringAsFixed(2)} TL', style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                            ],
                          ),
                          const SizedBox(height: 16),
                          CheckboxListTile(
                            contentPadding: EdgeInsets.zero,
                            controlAffinity: ListTileControlAffinity.leading,
                            title: const Text('Mesafeli satış sözleşmesini okudum ve onaylıyorum.', style: TextStyle(color: Colors.white, fontSize: 12)),
                            value: _agreeToTerms,
                            activeColor: Colors.white,
                            checkColor: theme.colorScheme.primary,
                            onChanged: (val) => setState(() => _agreeToTerms = val!),
                          ),
                          const SizedBox(height: 16),
                          SizedBox(
                            width: double.infinity,
                            height: 50,
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(backgroundColor: theme.cardColor, foregroundColor: theme.colorScheme.primary),
                              onPressed: _isLoading ? null : () => _handleCheckout(cart),
                              child: _isLoading ? const CircularProgressIndicator() : const Text('SİPARİŞİ TAMAMLA'),
                            ),
                          ),
                        ],
                      ),
                    ),
                  )
                ],
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String number, String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        children: [
          CircleAvatar(radius: 14, backgroundColor: Theme.of(context).colorScheme.primary, child: Text(number, style: const TextStyle(color: Colors.white, fontSize: 14))),
          const SizedBox(width: 8),
          Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
