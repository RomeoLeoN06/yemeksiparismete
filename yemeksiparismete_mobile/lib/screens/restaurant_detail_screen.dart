import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/restaurant.dart';
import '../models/product.dart';
import '../services/restaurant_service.dart';
import '../providers/cart_provider.dart';
import 'cart_screen.dart';
import '../services/group_order_service.dart';
import '../providers/auth_provider.dart';
import '../providers/group_order_provider.dart';

class RestaurantDetailScreen extends StatefulWidget {
  final Restaurant restaurant;

  const RestaurantDetailScreen({super.key, required this.restaurant});

  @override
  State<RestaurantDetailScreen> createState() => _RestaurantDetailScreenState();
}

class _RestaurantDetailScreenState extends State<RestaurantDetailScreen> with SingleTickerProviderStateMixin {
  final RestaurantService _restaurantService = RestaurantService();
  late Future<List<Product>> _productsFuture;
  late TabController _tabController;
  
  final TextEditingController _joinCodeController = TextEditingController();

   @override
   void initState() {
     super.initState();
     _tabController = TabController(length: 2, vsync: this);
     _productsFuture = _restaurantService.getProductsForRestaurant(widget.restaurant.id);
     
     WidgetsBinding.instance.addPostFrameCallback((_) {
       final auth = context.read<AuthProvider>();
       if (auth.user != null) {
         context.read<GroupOrderProvider>().init(auth.user?['id'] ?? '');
       }
     });
   }

   @override
   void dispose() {
     _joinCodeController.dispose();
     super.dispose();
   }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 250.0,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(widget.restaurant.name),
              background: widget.restaurant.bannerUrl != null && widget.restaurant.bannerUrl!.isNotEmpty
                  ? Image.network(widget.restaurant.bannerUrl!, fit: BoxFit.cover)
                  : Container(color: theme.cardColor, child: const Icon(Icons.fastfood, size: 80, color: Colors.grey)),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.star, color: Colors.amber, size: 24),
                      const SizedBox(width: 8),
                      Text(
                        widget.restaurant.rating.toStringAsFixed(1),
                        style: theme.textTheme.titleLarge,
                      ),
                      const SizedBox(width: 16),
                      Text(
                        widget.restaurant.category,
                        style: theme.textTheme.titleMedium?.copyWith(color: theme.colorScheme.primary),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    widget.restaurant.description,
                    style: theme.textTheme.bodyMedium,
                  ),
                   const SizedBox(height: 24),
                   _buildGroupOrderPanel(theme),
                   const SizedBox(height: 24),
                   Text(
                     'Menü',
                     style: theme.textTheme.displayMedium?.copyWith(fontSize: 24),
                   ),
                   const Divider(),
                 ],
               ),
             ),
           ),
          FutureBuilder<List<Product>>(
            future: _productsFuture,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const SliverToBoxAdapter(child: Center(child: CircularProgressIndicator()));
              } else if (snapshot.hasError) {
                return SliverToBoxAdapter(child: Center(child: Text('Hata: ${snapshot.error}')));
              } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                return const SliverToBoxAdapter(child: Center(child: Text('Bu restorana ait ürün bulunamadı.')));
              }

              final products = snapshot.data!;
              return SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final product = products[index];
                    return _buildProductItem(context, product);
                  },
                  childCount: products.length,
                ),
              );
            },
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const CartScreen()),
          );
        },
        label: const Text('Sepeti Görüntüle'),
        icon: const Icon(Icons.shopping_cart),
      ),
    );
  }

  Widget _buildProductItem(BuildContext context, Product product) {
    final theme = Theme.of(context);
    
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Row(
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: theme.cardColor,
                borderRadius: BorderRadius.circular(12),
              ),
              child: product.imageUrl != null && product.imageUrl!.isNotEmpty
                  ? ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.network(product.imageUrl!, fit: BoxFit.cover),
                    )
                  : const Icon(Icons.restaurant_menu, color: Colors.grey),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.name,
                    style: theme.textTheme.titleMedium,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    product.description,
                    style: theme.textTheme.bodySmall?.copyWith(color: Colors.grey[600]),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '₺${product.price.toStringAsFixed(2)}',
                    style: theme.textTheme.titleMedium?.copyWith(
                      color: theme.colorScheme.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
            Consumer2<CartProvider, GroupOrderProvider>(
              builder: (context, cart, group, child) {
                int quantity = 0;
                if (group.groupCode != null) {
                   final userId = context.read<AuthProvider>().user?['id'];
                   final items = group.items;
                   final myItem = items.firstWhere(
                     (i) => (i['productId'] ?? i['ProductId']) == product.id && (i['addedByUserId'] ?? i['AddedByUserId']) == userId,
                     orElse: () => null
                   );
                   quantity = myItem != null ? (myItem['quantity'] ?? myItem['Quantity'] ?? 0) : 0;
                } else {
                   quantity = cart.items[product.id]?.quantity ?? 0;
                }

                return Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (quantity > 0) ...[
                      IconButton(
                        icon: const Icon(Icons.remove_circle_outline, color: Colors.redAccent, size: 28),
                        onPressed: () {
                          final groupProvider = context.read<GroupOrderProvider>();
                          if (groupProvider.groupCode != null) {
                            final auth = context.read<AuthProvider>();
                            groupProvider.removeFromCart(product.id, auth.user?['id'] ?? '');
                          } else {
                            cart.removeSingleItem(product.id);
                          }
                        },
                      ),
                      Text(
                        '$quantity',
                        style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                      ),
                    ],
                    IconButton(
                      icon: Icon(
                        quantity > 0 ? Icons.add_circle : Icons.add_circle_outline,
                        color: theme.colorScheme.primary,
                        size: 32,
                      ),
                       onPressed: () {
                         final groupProvider = context.read<GroupOrderProvider>();
                         if (groupProvider.groupCode != null) {
                           final auth = context.read<AuthProvider>();
                           groupProvider.addToCart(
                             product.id, 
                             product.name, 
                             product.price, 
                             auth.user?['id'] ?? '', 
                             auth.user?['fullName'] ?? 'Müşteri'
                           );
                         } else {
                           cart.addItem(
                             product,
                             restaurantName: widget.restaurant.name,
                             restaurantAddress: widget.restaurant.address,
                           );
                         }
                         
                         if (quantity == 0) {
                           ScaffoldMessenger.of(context).showSnackBar(
                             SnackBar(
                               content: Text('${product.name} ${(groupProvider.groupCode != null ? 'grup sepetine' : 'sepete')} eklendi'),
                               duration: const Duration(seconds: 1),
                             ),
                           );
                         }
                       },
                    ),
                  ],
                );
              },
            ),
          ],
        ),
      ),
    );
   }

   Widget _buildGroupOrderPanel(ThemeData theme) {
     final groupProvider = context.watch<GroupOrderProvider>();
     
     if (groupProvider.groupCode != null) {
       return Container(
         padding: const EdgeInsets.all(16),
         decoration: BoxDecoration(
           color: Colors.green.withValues(alpha: 0.1),
           borderRadius: BorderRadius.circular(16),
           border: Border.all(color: Colors.green.withValues(alpha: 0.3)),
         ),
         child: Column(
           children: [
             Row(
               mainAxisAlignment: MainAxisAlignment.center,
               children: [
                 const Icon(Icons.people, color: Colors.green),
                 const SizedBox(width: 8),
                 Text('GRUP SİPARİŞİ AKTİF', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.green[800])),
               ],
             ),
             const SizedBox(height: 8),
             Text('Grup Kodu: ${groupProvider.groupCode}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
             const SizedBox(height: 16),
             if (groupProvider.items.isNotEmpty) ...[
               const Text('Grup Sepeti Özeti:', style: TextStyle(fontWeight: FontWeight.bold)),
                ...groupProvider.items.map((item) => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 2),
                  child: Text('${item['addedByUserName'] ?? item['AddedByUserName']}: ${item['quantity'] ?? item['Quantity']}x ${item['productName'] ?? item['ProductName']}', style: const TextStyle(fontSize: 12)),
                )),
             ] else 
               const Text('Grup sepeti henüz boş.', style: TextStyle(fontStyle: FontStyle.italic, fontSize: 12)),
             const SizedBox(height: 16),
             TextButton.icon(
               onPressed: () => groupProvider.leaveGroup(context.read<AuthProvider>().user?['id'] ?? ''),
               icon: const Icon(Icons.logout, color: Colors.red),
               label: const Text('GRUPTAN AYRIL / İPTAL ET', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
               style: TextButton.styleFrom(
                 backgroundColor: Colors.red.withValues(alpha: 0.1),
                 minimumSize: const Size(double.infinity, 50),
                 shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
               ),
             ),
           ],
         ),
       );
     }

     return Container(
       padding: const EdgeInsets.all(20),
       decoration: BoxDecoration(
         color: theme.cardColor,
         borderRadius: BorderRadius.circular(24),
         border: Border.all(color: theme.colorScheme.primary.withOpacity(0.2)),
         boxShadow: [
           BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 15, offset: const Offset(0, 8))
         ],
       ),
       child: Column(
         crossAxisAlignment: CrossAxisAlignment.stretch,
         children: [
           Row(
             children: [
               Container(
                 padding: const EdgeInsets.all(10),
                 decoration: BoxDecoration(color: theme.colorScheme.primary.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
                 child: Icon(Icons.groups, color: theme.colorScheme.primary),
               ),
               const SizedBox(width: 12),
               const Expanded(
                 child: Column(
                   crossAxisAlignment: CrossAxisAlignment.start,
                   children: [
                     Text('Sosyal Sepet 👥', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                     Text('Arkadaşlarınla birlikte sipariş ver!', style: TextStyle(fontSize: 12, color: Colors.grey)),
                   ],
                 ),
               ),
             ],
           ),
           const SizedBox(height: 20),
           Row(
             children: [
               Expanded(
                 child: ElevatedButton(
                   onPressed: groupProvider.isConnecting ? null : () async {
                     final auth = context.read<AuthProvider>();
                     if (auth.user == null) {
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Lütfen önce giriş yapın.')));
                        return;
                     }
                     await groupProvider.createGroup(widget.restaurant.id, auth.user?['id'] ?? '');
                   },
                   style: ElevatedButton.styleFrom(
                     backgroundColor: theme.colorScheme.primary,
                     foregroundColor: Colors.black,
                     padding: const EdgeInsets.symmetric(vertical: 16),
                     shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                   ),
                   child: groupProvider.isConnecting 
                     ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black))
                     : const Text('GRUP BAŞLAT', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.1)),
                 ),
               ),
               const SizedBox(width: 12),
               Expanded(
                 child: OutlinedButton(
                   onPressed: () => _showJoinDialog(theme, groupProvider),
                   style: OutlinedButton.styleFrom(
                     padding: const EdgeInsets.symmetric(vertical: 16),
                     shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                     side: BorderSide(color: theme.colorScheme.primary),
                   ),
                   child: const Text('KODA KATIL'),
                 ),
               ),
             ],
           ),
         ],
       ),
     );
   }

   void _showJoinDialog(ThemeData theme, GroupOrderProvider groupProvider) {
     showDialog(
       context: context,
       builder: (context) => AlertDialog(
         title: const Text('Gruba Katıl'),
         content: TextField(
           controller: _joinCodeController,
           decoration: const InputDecoration(hintText: '6 Haneli Grup Kodunu Girin'),
           keyboardType: TextInputType.number,
           maxLength: 6,
         ),
         actions: [
           TextButton(onPressed: () => Navigator.pop(context), child: const Text('İptal')),
           ElevatedButton(
             onPressed: () async {
               if (_joinCodeController.text.length == 6) {
                 await groupProvider.joinGroup(_joinCodeController.text);
                 Navigator.pop(context);
               }
             },
             child: const Text('Katıl'),
           ),
         ],
       ),
     );
   }
 }
