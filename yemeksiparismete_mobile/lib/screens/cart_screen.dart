import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cart_provider.dart';
import 'checkout_screen.dart';

import '../services/coupon_service.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final TextEditingController _couponController = TextEditingController();
  final CouponService _couponService = CouponService();
  bool _isValidating = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _fetchAvailableCoupons();
    });
  }

  Future<void> _fetchAvailableCoupons() async {
    final coupons = await _couponService.getCoupons();
    if (mounted) {
      context.read<CartProvider>().setAvailableCoupons(coupons);
    }
  }

  void _goToCheckout() {
    final cart = context.read<CartProvider>();
    if (cart.items.isEmpty) return;
    
    if (cart.finalAmount < 300) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Minimum sepet tutarı 300 TL olmalıdır. Eksik: ₺${(300 - cart.finalAmount).toStringAsFixed(2)}'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }
    
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const CheckoutScreen()),
    );
  }


  Future<void> _applyCoupon() async {
    final code = _couponController.text.trim();
    if (code.isEmpty) return;

    setState(() => _isValidating = true);
    final result = await _couponService.validateCoupon(code);
    setState(() => _isValidating = false);

    if (result['success']) {
      final couponData = result['data'];
      final discount = (couponData['discountAmount'] ?? couponData['DiscountAmount'] ?? 0).toDouble();
      final minAmount = (couponData['minimumOrderAmount'] ?? couponData['MinimumOrderAmount'] ?? 300).toDouble();

      final cart = context.read<CartProvider>();
      if (cart.totalAmount < minAmount) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Bu kupon için sepet tutarı en az ₺$minAmount olmalıdır.')),
        );
        return;
      }

      cart.setCoupon(code, discount);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Kupon uygulandı!'), backgroundColor: Colors.green),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['message'])),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();
    final theme = Theme.of(context);
    final bool isBelowMin = cart.finalAmount < 300;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Sepetim'),
      ),
      body: cart.items.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.shopping_cart_outlined, size: 80, color: Colors.grey[400]),
                  const SizedBox(height: 16),
                  Text('Sepetiniz şu an boş.', style: theme.textTheme.titleMedium),
                ],
              ),
            )
          : Column(
              children: [
                if (cart.items.isNotEmpty && cart.items.values.first.restaurantName != null)
                  Container(
                    margin: const EdgeInsets.all(16),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: theme.colorScheme.primary.withOpacity(0.3)),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.storefront, color: theme.colorScheme.primary),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                cart.items.values.first.restaurantName!,
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white),
                              ),
                              if (cart.items.values.first.restaurantAddress != null)
                                Text(
                                  cart.items.values.first.restaurantAddress!,
                                  style: TextStyle(fontSize: 12, color: Colors.grey[400]),
                                ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                Expanded(
                  child: ListView.builder(
                    itemCount: cart.items.length,
                    itemBuilder: (context, index) {
                      final cartItem = cart.items.values.toList()[index];
                      final productId = cart.items.keys.toList()[index];

                      return Card(
                        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        child: Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Row(
                            children: [
                              Container(
                                width: 60,
                                height: 60,
                                decoration: BoxDecoration(
                                  color: theme.cardColor,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: cartItem.product.imageUrl != null && cartItem.product.imageUrl!.isNotEmpty
                                    ? ClipRRect(
                                        borderRadius: BorderRadius.circular(8),
                                        child: Image.network(cartItem.product.imageUrl!, fit: BoxFit.cover),
                                      )
                                    : Icon(Icons.fastfood, color: theme.disabledColor),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(cartItem.product.name, style: theme.textTheme.titleMedium),
                                    Text(
                                      '₺${cartItem.product.price.toStringAsFixed(2)}',
                                      style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.primary),
                                    ),
                                  ],
                                ),
                              ),
                              Row(
                                children: [
                                  IconButton(
                                    icon: const Icon(Icons.remove_circle_outline),
                                    onPressed: () => cart.removeSingleItem(productId),
                                  ),
                                  Text('${cartItem.quantity}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                  IconButton(
                                    icon: const Icon(Icons.add_circle_outline),
                                    onPressed: () => cart.addItem(cartItem.product),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(20.0),
                  decoration: BoxDecoration(
                    color: theme.cardColor,
                    boxShadow: [
                      BoxShadow(color: theme.shadowColor, blurRadius: 10, offset: const Offset(0, -5))
                    ],
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
                  ),
                  child: Column(
                    children: [
                      // KUPONLAR BAŞLIK
                      const Row(
                        children: [
                          Icon(Icons.local_offer_outlined, size: 18, color: Colors.grey),
                          SizedBox(width: 8),
                          Text('SİZE ÖZEL KUPONLAR', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12, letterSpacing: 1.2, color: Colors.grey)),
                        ],
                      ),
                      const SizedBox(height: 12),
                      // AKILLI KUPON KARTLARI
                      SizedBox(
                        height: 85,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: cart.availableCoupons.length,
                          itemBuilder: (context, index) {
                            final c = cart.availableCoupons[index];
                            final min = (c['minimumOrderAmount'] ?? c['MinimumOrderAmount'] ?? 0).toDouble();
                            final isEligible = cart.totalAmount >= min;
                            final isActive = cart.couponCode == (c['code'] ?? c['Code']);
                            final missing = min - cart.totalAmount;

                            return GestureDetector(
                              onTap: isEligible ? () {
                                cart.setCoupon(c['code'] ?? c['Code'], (c['discountAmount'] ?? c['DiscountAmount'] ?? 0).toDouble());
                                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Kupon uygulandı!'), duration: Duration(seconds: 1)));
                              } : null,
                              child: Container(
                                width: 160,
                                margin: const EdgeInsets.only(right: 12),
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: isActive ? theme.colorScheme.primary.withOpacity(0.1) : (isEligible ? theme.cardColor : theme.cardColor.withOpacity(0.5)),
                                  border: Border.all(
                                    color: isActive ? theme.colorScheme.primary : (isEligible ? Colors.grey[800]! : Colors.red.withOpacity(0.3)),
                                    width: isActive ? 2 : 1
                                  ),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(c['code'] ?? c['Code'], style: TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: isEligible ? Colors.white : Colors.grey)),
                                        if (isActive) Icon(Icons.check_circle, size: 16, color: theme.colorScheme.primary),
                                      ],
                                    ),
                                    const SizedBox(height: 4),
                                    Text('₺${(c['discountAmount'] ?? c['DiscountAmount']).toInt()} İNDİRİM', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: isEligible ? theme.colorScheme.primary : Colors.grey)),
                                    if (!isEligible) 
                                      Padding(
                                        padding: const EdgeInsets.only(top: 4),
                                        child: Text('+₺${missing.toInt()} DAHA', style: const TextStyle(fontSize: 10, color: Colors.red, fontWeight: FontWeight.bold)),
                                      ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                      const SizedBox(height: 25),
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _couponController,
                              decoration: const InputDecoration(
                                hintText: 'Örn: METE300',
                                border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
                                contentPadding: EdgeInsets.symmetric(horizontal: 16),
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          ElevatedButton(
                            onPressed: _isValidating ? null : _applyCoupon,
                            style: ElevatedButton.styleFrom(
                              minimumSize: const Size(80, 50),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            child: _isValidating ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2)) : const Text('Uygula'),
                          ),
                        ],
                      ),


                      const SizedBox(height: 20),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Ara Toplam:', style: TextStyle(fontSize: 16, color: Colors.grey)),
                          Text('₺${cart.totalAmount.toStringAsFixed(2)}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      if (cart.discountAmount > 0)
                        Padding(
                          padding: const EdgeInsets.only(top: 8),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('İndirim (${cart.couponCode}):', style: const TextStyle(fontSize: 16, color: Colors.green)),
                              Text('-₺${cart.discountAmount.toStringAsFixed(2)}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.green)),
                            ],
                          ),
                        ),
                      const Divider(height: 32),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Toplam:', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                          Text(
                            '₺${cart.finalAmount.toStringAsFixed(2)}',
                            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: theme.colorScheme.primary),
                          ),
                        ],
                      ),
                      if (isBelowMin)
                        Padding(
                          padding: const EdgeInsets.only(top: 12),
                          child: Row(
                            children: [
                              const Icon(Icons.error_outline, color: Colors.red, size: 18),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  'Minimum sipariş tutarı ₺300.00 olmalıdır.',
                                  style: TextStyle(color: Colors.red[400], fontSize: 13, fontWeight: FontWeight.bold),
                                ),
                              ),
                            ],
                          ),
                        ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        height: 56,
                        child: ElevatedButton(
                          onPressed: (cart.items.isEmpty || isBelowMin) ? null : _goToCheckout,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: isBelowMin ? Colors.grey : null,
                          ),
                          child: Text(isBelowMin ? 'MİN. ₺300 OLMALI' : 'Ödemeye Geç', style: const TextStyle(fontSize: 18)),
                        ),
                      ),
                    ],
                  ),
                )
              ],
            ),
    );
  }
}
