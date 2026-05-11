import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/restaurant.dart';
import '../models/product.dart';
import '../services/restaurant_service.dart';
import '../providers/cart_provider.dart';
import 'cart_screen.dart';

class RestaurantDetailScreen extends StatefulWidget {
  final Restaurant restaurant;

  const RestaurantDetailScreen({super.key, required this.restaurant});

  @override
  State<RestaurantDetailScreen> createState() => _RestaurantDetailScreenState();
}

class _RestaurantDetailScreenState extends State<RestaurantDetailScreen> {
  final RestaurantService _restaurantService = RestaurantService();
  late Future<List<Product>> _productsFuture;

  @override
  void initState() {
    super.initState();
    _productsFuture = _restaurantService.getProductsForRestaurant(widget.restaurant.id);
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
            Consumer<CartProvider>(
              builder: (context, cart, child) {
                final cartItem = cart.items[product.id];
                final quantity = cartItem?.quantity ?? 0;

                return Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (quantity > 0) ...[
                      IconButton(
                        icon: const Icon(Icons.remove_circle_outline, color: Colors.redAccent, size: 28),
                        onPressed: () => cart.removeSingleItem(product.id),
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
                        cart.addItem(
                          product,
                          restaurantName: widget.restaurant.name,
                          restaurantAddress: widget.restaurant.address,
                        );
                        if (quantity == 0) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('${product.name} sepete eklendi'),
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
}
