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
      floatingActionButton: _currentIndex == 1
          ? FloatingActionButton(
              onPressed: () => _showProductDialog(),
              child: const Icon(Icons.add),
            )
          : null,
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
          final status = order['status'].toString().toLowerCase();

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
                      Chip(
                        label: Text(_getStatusText(status), style: const TextStyle(color: Colors.white, fontSize: 10)),
                        backgroundColor: _getStatusColor(status),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text('Müşteri: ${order['customerName']}'),
                  Text('Telefon: ${order['customerPhone'] ?? '-'}'),
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
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      _statusButton(order['id'], 'preparing', 'Hazırla', Colors.blue, status == 'preparing'),
                      _statusButton(order['id'], 'on_the_way', 'Yolda', Colors.purple, status == 'on_the_way' || status == 'yolda'),
                      _statusButton(order['id'], 'delivered', 'Teslim', Colors.green, status == 'delivered'),
                      _statusButton(order['id'], 'cancelled', 'İptal', Colors.red, status == 'cancelled' || status == 'canceled' || status == 'iptal edildi'),
                    ],
                  )
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _statusButton(int id, String status, String label, Color color, bool isActive) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: isActive ? color : Colors.grey[800],
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        minimumSize: const Size(0, 36),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
      onPressed: () => _updateOrderStatus(id, status),
      child: Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
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

  Widget _buildProductsTab(ThemeData theme) {
    if (_products.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.fastfood_outlined, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            const Text('Henüz ürün eklenmemiş.', style: TextStyle(fontSize: 18, color: Colors.grey)),
            const SizedBox(height: 8),
            ElevatedButton.icon(
              onPressed: () => _showProductDialog(),
              icon: const Icon(Icons.add),
              label: const Text('İlk Ürünü Ekle'),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _products.length,
      itemBuilder: (context, index) {
        final product = _products[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 16),
          decoration: BoxDecoration(
            color: theme.cardColor,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: IntrinsicHeight(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Product Image
                  Container(
                    width: 100,
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                    ),
                    child: Image.network(
                      product['imageUrl'] ?? 'https://via.placeholder.com/150',
                      fit: BoxFit.cover,
                      errorBuilder: (c, e, s) => const Icon(Icons.fastfood, size: 40, color: Colors.grey),
                    ),
                  ),
                  // Product Details
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.all(12.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  product['name'],
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              Text(
                                '₺${product['price']}',
                                style: TextStyle(
                                  color: theme.colorScheme.primary,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            product['category'] ?? 'Genel',
                            style: TextStyle(color: Colors.grey[600], fontSize: 12),
                          ),
                          const SizedBox(height: 4),
                          Expanded(
                            child: Text(
                              product['description'] ?? '',
                              style: TextStyle(color: Colors.grey[500], fontSize: 12),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              const Spacer(),
                              IconButton(
                                constraints: const BoxConstraints(),
                                padding: EdgeInsets.zero,
                                icon: const Icon(Icons.edit_outlined, color: Colors.blue, size: 20),
                                onPressed: () => _showProductDialog(product: product),
                              ),
                              const SizedBox(width: 8),
                              IconButton(
                                constraints: const BoxConstraints(),
                                padding: EdgeInsets.zero,
                                icon: const Icon(Icons.delete_outline, color: Colors.red, size: 20),
                                onPressed: () => _showDeleteConfirmDialog(product['id']),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  void _showDeleteConfirmDialog(int productId) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Ürünü Sil'),
        content: const Text('Bu ürünü silmek istediğinize emin misiniz?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Vazgeç')),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              final res = await _service.deleteProduct(productId);
              if (res['success']) {
                _loadData();
              } else {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(res['message'])));
                }
              }
            },
            child: const Text('Sil', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  void _showProductDialog({Map<String, dynamic>? product}) {
    final isEditing = product != null;
    final nameController = TextEditingController(text: product?['name']);
    final priceController = TextEditingController(text: product?['price']?.toString());
    final descController = TextEditingController(text: product?['description']);
    final categoryController = TextEditingController(text: product?['category']);
    final imageController = TextEditingController(text: product?['imageUrl']);

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(isEditing ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle', style: const TextStyle(fontWeight: FontWeight.bold)),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildDialogField(nameController, 'Ürün Adı', Icons.title),
              _buildDialogField(priceController, 'Fiyat', Icons.attach_money, isNumber: true),
              _buildDialogField(descController, 'Açıklama', Icons.description),
              _buildDialogField(categoryController, 'Kategori', Icons.category),
              _buildDialogField(imageController, 'Resim URL', Icons.image),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('İptal', style: TextStyle(color: Colors.grey)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            ),
            onPressed: () async {
              if (nameController.text.isEmpty || priceController.text.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Lütfen isim ve fiyat giriniz.')));
                return;
              }

              final data = {
                'name': nameController.text,
                'price': double.tryParse(priceController.text) ?? 0.0,
                'description': descController.text,
                'category': categoryController.text,
                'imageUrl': imageController.text,
                'stock': 999, // Varsayılan değer
              };

              Map<String, dynamic> res;
              if (isEditing) {
                res = await _service.updateProduct(product['id'], data);
              } else {
                res = await _service.addProduct(data);
              }

              if (res['success']) {
                Navigator.pop(context);
                _loadData();
              } else {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(res['message'])));
                }
              }
            },
            child: Text(isEditing ? 'Güncelle' : 'Ekle'),
          ),
        ],
      ),
    );
  }

  Widget _buildDialogField(TextEditingController controller, String label, IconData icon, {bool isNumber = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: TextField(
        controller: controller,
        keyboardType: isNumber ? TextInputType.number : TextInputType.text,
        decoration: InputDecoration(
          labelText: label,
          prefixIcon: Icon(icon, size: 20),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        ),
      ),
    );
  }
}
