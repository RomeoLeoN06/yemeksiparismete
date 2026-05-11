import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/location_provider.dart';
import '../providers/cart_provider.dart';
import '../services/restaurant_service.dart';
import '../services/location_service.dart';
import '../models/restaurant.dart';
import 'restaurant_detail_screen.dart';
import 'cart_screen.dart';
import 'profile_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final RestaurantService _restaurantService = RestaurantService();
  final LocationService _locationService = LocationService();

  List<Restaurant> _restaurants = [];
  List<Restaurant> _filteredRestaurants = [];
  bool _isLoading = true;

  String _activeCategory = 'Tümü';
  String _searchTerm = '';

  List<dynamic> _cities = [];
  List<dynamic> _districts = [];
  int? _selectedCityId;
  int? _selectedDistrictId;

  final List<Map<String, dynamic>> _categories = [
    {'id': 'Tümü', 'name': 'Tümü', 'icon': Icons.apps},
    {'id': 'Burger', 'name': 'Burger', 'icon': Icons.fastfood},
    {'id': 'Pizza', 'name': 'Pizza', 'icon': Icons.local_pizza},
    {'id': 'Kebap', 'name': 'Kebap', 'icon': Icons.kebab_dining},
    {'id': 'Tatlı', 'name': 'Tatlı', 'icon': Icons.cake},
    {'id': 'Kahve', 'name': 'Kahve', 'icon': Icons.local_cafe},
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final locProvider = context.read<LocationProvider>();
      if (locProvider.selectedDistrict == null) {
        await _fetchCities();
        if (mounted) _showLocationGate(context);
      } else {
        _fetchRestaurants();
      }
    });
  }

  Future<void> _fetchCities() async {
    final cities = await _locationService.getCities();
    setState(() => _cities = cities);
  }

  Future<void> _fetchDistricts(int cityId) async {
    final districts = await _locationService.getDistricts(cityId);
    setState(() {
      _districts = districts;
      _selectedDistrictId = null;
    });
  }

  void _showLocationGate(BuildContext context) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
              title: const Column(
                children: [
                  Icon(Icons.location_on, size: 48, color: Colors.redAccent),
                  SizedBox(height: 16),
                  Text('Nereye Gönderelim?', textAlign: TextAlign.center, style: TextStyle(fontWeight: FontWeight.bold)),
                ],
              ),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    'Size en yakın restoranları görebilmeniz için lütfen konumunuzu seçin.',
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  DropdownButtonFormField<int>(
                    decoration: InputDecoration(
                      labelText: 'İl Seçin',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    value: _selectedCityId,
                    items: _cities.map((city) => DropdownMenuItem<int>(
                          value: city['id'],
                          child: Text(city['name']),
                        )).toList(),
                    onChanged: (value) async {
                      setModalState(() {
                        _selectedCityId = value;
                        _selectedDistrictId = null;
                        _districts = [];
                      });
                      final newDistricts = await _locationService.getDistricts(value!);
                      setModalState(() {
                        _districts = newDistricts;
                      });
                    },
                  ),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<int>(
                    decoration: InputDecoration(
                      labelText: 'İlçe Seçin',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    value: _selectedDistrictId,
                    items: _districts.map((district) => DropdownMenuItem<int>(
                          value: district['id'],
                          child: Text(district['name']),
                        )).toList(),
                    onChanged: _selectedCityId == null
                        ? null
                        : (value) {
                            setModalState(() => _selectedDistrictId = value);
                          },
                  ),
                ],
              ),
              actions: [
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: _selectedDistrictId == null
                        ? null
                        : () async {
                            final cart = context.read<CartProvider>();
                            if (cart.items.isNotEmpty) {
                              final resName = cart.items.values.first.restaurantName ?? 'bir';
                              final resAddr = cart.items.values.first.restaurantAddress ?? 'farklı konumdaki';
                              
                              final shouldProceed = await showDialog<bool>(
                                context: context,
                                builder: (ctx) => AlertDialog(
                                  title: const Text('Dikkat!'),
                                  content: Text('Sepetinizde şu anda $resAddr konumunda bulunan $resName restoranına ait ürünler var. Adres değiştirmek istediğinize emin misiniz?'),
                                  actions: [
                                    TextButton(
                                      onPressed: () => Navigator.pop(ctx, false),
                                      child: const Text('İptal'),
                                    ),
                                    TextButton(
                                      onPressed: () => Navigator.pop(ctx, true),
                                      child: const Text('Devam Et'),
                                    ),
                                  ],
                                ),
                              );
                              
                              if (shouldProceed != true) {
                                return;
                              } else {
                                cart.clear();
                              }
                            }

                            final city = _cities.firstWhere((c) => c['id'] == _selectedCityId);
                            final district = _districts.firstWhere((d) => d['id'] == _selectedDistrictId);
                            final locProvider = context.read<LocationProvider>();
                            locProvider.setCity(city);
                            locProvider.setDistrict(district);
                            if (context.mounted) {
                              Navigator.pop(context);
                              _fetchRestaurants();
                            }
                          },
                    child: const Text('KEŞFETMEYE BAŞLA'),
                  ),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Future<void> _fetchRestaurants() async {
    setState(() => _isLoading = true);
    try {
      final locProvider = context.read<LocationProvider>();
      final districtId = locProvider.selectedDistrict?['id'];
      
      final restaurants = await _restaurantService.getRestaurants(districtId: districtId);
      setState(() {
        _restaurants = restaurants;
        _isLoading = false;
        _applyFilters();
      });
    } catch (e) {
      print('Error: $e');
      setState(() => _isLoading = false);
    }
  }

  void _applyFilters() {
    setState(() {
      final query = _searchTerm.trim().toLowerCase();
      final cat = _activeCategory.toLowerCase();
      
      _filteredRestaurants = _restaurants.where((r) {
        final matchesCategory = cat == 'tümü' || 
                                r.category.toLowerCase().contains(cat) ||
                                r.name.toLowerCase().contains(cat);
        
        final matchesSearch = query.isEmpty || 
                              r.name.toLowerCase().contains(query) ||
                              r.category.toLowerCase().contains(query) ||
                              r.description.toLowerCase().contains(query);
        
        return matchesCategory && matchesSearch;
      }).toList();
      
      print('Filtered: ${_filteredRestaurants.length} / ${_restaurants.length}');
    });
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;
    final locProvider = context.watch<LocationProvider>();
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        leadingWidth: 70,
        leading: Padding(
          padding: const EdgeInsets.only(left: 16.0, top: 8, bottom: 8),
          child: Image.asset('assets/images/logo.png', fit: BoxFit.contain, errorBuilder: (context, error, stackTrace) => const Icon(Icons.fastfood, color: Colors.orange)),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Merhaba, ${user?['fullName'] ?? ''}', style: const TextStyle(fontSize: 16)),
            if (locProvider.selectedDistrict != null)
              GestureDetector(
                onTap: () async {
                  await _fetchCities();
                  if (context.mounted) _showLocationGate(context);
                },
                child: Container(
                  margin: const EdgeInsets.only(top: 4),
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.location_on, size: 14, color: Colors.white),
                      const SizedBox(width: 4),
                      Text(
                        '${locProvider.selectedDistrict!['name']}, ${locProvider.selectedCity!['name']}',
                        style: const TextStyle(fontSize: 12, color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(width: 4),
                      const Icon(Icons.keyboard_arrow_down, size: 14, color: Colors.white),
                    ],
                  ),
                ),
              ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.shopping_cart_outlined),
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const CartScreen())),
          ),
          IconButton(
            icon: const Icon(Icons.person_outline),
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (context) => const ProfileScreen())),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : CustomScrollView(
              slivers: [
                // Hero / Search Area
                SliverToBoxAdapter(
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.surface,
                      borderRadius: const BorderRadius.only(
                        bottomLeft: Radius.circular(30),
                        bottomRight: Radius.circular(30),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Bugün ne yemek istersin?', 
                          style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          onChanged: (val) {
                            _searchTerm = val;
                            _applyFilters();
                          },
                          decoration: InputDecoration(
                            hintText: 'Restoran veya yemek ara...',
                            prefixIcon: const Icon(Icons.search),
                            filled: true,
                            fillColor: theme.scaffoldBackgroundColor,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(15),
                              borderSide: BorderSide.none,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                
                // Location Bar
                if (locProvider.selectedDistrict != null)
                  SliverToBoxAdapter(
                    child: GestureDetector(
                      onTap: () async {
                        await _fetchCities();
                        if (context.mounted) _showLocationGate(context);
                      },
                      child: Container(
                        margin: const EdgeInsets.only(left: 16, right: 16, top: 20),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: theme.cardColor,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(color: theme.shadowColor, blurRadius: 10, offset: const Offset(0, 4))
                          ]
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(color: theme.colorScheme.primary.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
                              child: Icon(Icons.location_on, color: theme.colorScheme.primary),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('Teslimat Bölgesi', style: TextStyle(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.bold)),
                                  const SizedBox(height: 2),
                                  Text('${locProvider.selectedDistrict!['name']}, ${locProvider.selectedCity!['name']}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                                ],
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(color: theme.colorScheme.primary, borderRadius: BorderRadius.circular(8)),
                              child: const Text('Değiştir', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 12)),
                            )
                          ],
                        ),
                      ),
                    ),
                  ),
                
                // Categories
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 24.0),
                    child: SizedBox(
                      height: 100,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        itemCount: _categories.length,
                        itemBuilder: (context, index) {
                          final cat = _categories[index];
                          final isActive = _activeCategory == cat['id'];
                          return GestureDetector(
                            onTap: () {
                              setState(() => _activeCategory = cat['id']);
                              _applyFilters();
                            },
                            child: Container(
                              margin: const EdgeInsets.only(right: 16),
                              child: Column(
                                children: [
                                  Container(
                                    width: 65,
                                    height: 65,
                                    decoration: BoxDecoration(
                                      color: isActive ? theme.colorScheme.primary : theme.cardColor,
                                      borderRadius: BorderRadius.circular(20),
                                      boxShadow: [
                                        BoxShadow(color: theme.shadowColor, blurRadius: 10, offset: const Offset(0, 4))
                                      ]
                                    ),
                                    child: Icon(cat['icon'], color: isActive ? Colors.black : theme.colorScheme.primary, size: 30),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(cat['name'], style: TextStyle(
                                    fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                                    color: isActive ? theme.colorScheme.primary : theme.textTheme.bodyLarge?.color,
                                  ))
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                ),

                // Header
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          _searchTerm.isNotEmpty ? '"$_searchTerm" Sonuçları' : 
                          _activeCategory != 'Tümü' ? '$_activeCategory Restoranları' : 'Tüm Restoranlar',
                          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)
                        ),
                        Text('${_filteredRestaurants.length} sonuç', style: const TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                ),

                // Grid
                if (_filteredRestaurants.isEmpty)
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(40.0),
                      child: Center(
                        child: Column(
                          children: [
                            Icon(Icons.search_off, size: 64, color: Colors.grey[400]),
                            const SizedBox(height: 16),
                            const Text('Sonuç bulunamadı', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                    ),
                  )
                else
                  SliverPadding(
                    padding: const EdgeInsets.all(16.0),
                    sliver: SliverGrid(
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio: 0.8,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                      ),
                      delegate: SliverChildBuilderDelegate(
                        (context, index) {
                          final restaurant = _filteredRestaurants[index];
                          return GestureDetector(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => RestaurantDetailScreen(restaurant: restaurant),
                                ),
                              );
                            },
                            child: Card(
                              clipBehavior: Clip.antiAlias,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              elevation: 2,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Expanded(
                                    flex: 3,
                                    child: Stack(
                                      fit: StackFit.expand,
                                      children: [
                                        restaurant.bannerUrl != null && restaurant.bannerUrl!.isNotEmpty
                                            ? Image.network(restaurant.bannerUrl!, fit: BoxFit.cover)
                                            : Container(color: Colors.grey[300]),
                                        Positioned(
                                          top: 8, right: 8,
                                          child: Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                            decoration: BoxDecoration(color: theme.cardColor, borderRadius: BorderRadius.circular(12)),
                                            child: Row(
                                              children: [
                                                const Icon(Icons.star, size: 14, color: Colors.orange),
                                                const SizedBox(width: 4),
                                                Text(restaurant.rating.toStringAsFixed(1), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                                              ],
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Expanded(
                                    flex: 2,
                                    child: Padding(
                                      padding: const EdgeInsets.all(12.0),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            restaurant.name,
                                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                                            maxLines: 1, overflow: TextOverflow.ellipsis,
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            restaurant.category,
                                            style: TextStyle(color: Colors.grey[600], fontSize: 12),
                                          ),
                                          const Spacer(),
                                          Row(
                                            children: [
                                              const Icon(Icons.delivery_dining, size: 14, color: Colors.grey),
                                              const SizedBox(width: 4),
                                              Text('30-45 dk', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                                            ],
                                          )
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                        childCount: _filteredRestaurants.length,
                      ),
                    ),
                  ),
              ],
            ),
    );
  }
}
