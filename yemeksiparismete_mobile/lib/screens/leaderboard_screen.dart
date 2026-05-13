import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../services/api_constants.dart';

class LeaderboardScreen extends StatefulWidget {
  const LeaderboardScreen({super.key});

  @override
  State<LeaderboardScreen> createState() => _LeaderboardScreenState();
}

class _LeaderboardScreenState extends State<LeaderboardScreen> {
  List<dynamic> _users = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchLeaderboard();
  }

  Future<void> _fetchLeaderboard() async {
    try {
      print('Fetching leaderboard from: ${ApiConstants.baseUrl}/user/leaderboard');
      final response = await http.get(Uri.parse('${ApiConstants.baseUrl}/user/leaderboard'));
      print('Leaderboard status: ${response.statusCode}');
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        print('Leaderboard data: $data');
        setState(() {
          List<dynamic> rawList = [];
          if (data is List) {
            rawList = data;
          } else if (data is Map && data.containsKey('\$values')) {
            rawList = data['\$values'];
          }
          
          // Normalize keys to camelCase just in case
          _users = rawList.map((u) => {
            'fullName': u['fullName'] ?? u['FullName'] ?? 'İsimsiz',
            'greenPoints': u['greenPoints'] ?? u['GreenPoints'] ?? 0,
            'profileImageBase64': u['profileImageBase64'] ?? u['ProfileImageBase64']
          }).toList();
          
          _isLoading = false;
        });
      } else {
        print('Leaderboard error response: ${response.body}');
        setState(() => _isLoading = false);
      }
    } catch (e) {
      print('Leaderboard fetch error: $e');
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Doğa Kahramanları'),
        centerTitle: true,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _users.isEmpty
            ? const Center(child: Padding(
                padding: EdgeInsets.all(40.0),
                child: Text('Henüz puan kazanmış kahraman bulunmuyor. İlk sen ol!', textAlign: TextAlign.center),
              ))
            : SingleChildScrollView(
                child: Column(
                  children: [
                    _buildHeader(),
                    if (_users.isNotEmpty) _buildPodium(),
                    const SizedBox(height: 20),
                    if (_users.length > 3) _buildList(),
                  ],
                ),
              ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(24),
      width: double.infinity,
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
      ),
      child: Column(
        children: [
          const Icon(Icons.emoji_events, size: 80, color: Colors.amber),
          const SizedBox(height: 16),
          const Text(
            'Eco-Heroes Liderlik Tablosu',
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(height: 8),
          const Text(
            'En çok Yeşil Puan kazanan kahramanlarımız. Her ay sürpriz ödüller veriyoruz!',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.grey),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.green.withOpacity(0.1),
              borderRadius: BorderRadius.circular(50),
              border: Border.all(color: Colors.green.withOpacity(0.3)),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.stars, color: Colors.green, size: 18),
                SizedBox(width: 8),
                Text('Bu Ayın Ödülü: ₺500 Hediye Çeki', 
                  style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 12)),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildPodium() {
    // İlk 3'ü podyuma koyalım
    final top3 = _users.take(3).toList();
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 30),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          // 2. Sıra
          if (top3.length >= 2) _buildPodiumItem(top3[1], 2, 100),
          const SizedBox(width: 15),
          // 1. Sıra
          _buildPodiumItem(top3[0], 1, 140),
          const SizedBox(width: 15),
          // 3. Sıra
          if (top3.length >= 3) _buildPodiumItem(top3[2], 3, 90),
        ],
      ),
    );
  }

  Widget _buildPodiumItem(dynamic user, int rank, double height) {
    return Column(
      children: [
        Stack(
          alignment: Alignment.center,
          children: [
            CircleAvatar(
              radius: rank == 1 ? 45 : 35,
              backgroundColor: rank == 1 ? Colors.amber : Colors.grey[800],
              child: CircleAvatar(
                radius: rank == 1 ? 41 : 32,
                backgroundImage: user['profileImageBase64'] != null && user['profileImageBase64'].toString().isNotEmpty
                  ? (() {
                      try {
                        return MemoryImage(base64Decode(user['profileImageBase64']));
                      } catch (e) {
                        return null;
                      }
                    })()
                  : null,
                child: (user['profileImageBase64'] == null || user['profileImageBase64'].toString().isEmpty)
                  ? Text((user['fullName'] ?? 'U')[0].toUpperCase(), style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold))
                  : null,
              ),
            ),
            Positioned(
              bottom: 0,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: rank == 1 ? Colors.amber : Colors.grey[700],
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text('#$rank', style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 12)),
              ),
            )
          ],
        ),
        const SizedBox(height: 12),
        Text((user['fullName'] ?? 'Kullanıcı').split(' ')[0], 
          style: TextStyle(fontWeight: rank == 1 ? FontWeight.bold : FontWeight.normal, fontSize: 14)),
        Text('${user['greenPoints']} P', 
          style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 12)),
      ],
    );
  }

  Widget _buildList() {
    final others = _users.skip(3).toList();
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: others.length,
      itemBuilder: (context, index) {
        final user = others[index];
        final rank = index + 4;
        return Container(
          margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 5),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Theme.of(context).cardColor,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            children: [
              SizedBox(width: 30, child: Text('#$rank', style: const TextStyle(color: Colors.grey, fontWeight: FontWeight.bold))),
              CircleAvatar(
                radius: 20,
                backgroundImage: user['profileImageBase64'] != null && user['profileImageBase64'].toString().isNotEmpty
                  ? (() {
                      try {
                        return MemoryImage(base64Decode(user['profileImageBase64']));
                      } catch (e) {
                        return null;
                      }
                    })()
                  : null,
                child: (user['profileImageBase64'] == null || user['profileImageBase64'].toString().isEmpty)
                  ? Text((user['fullName'] ?? 'U')[0].toUpperCase())
                  : null,
              ),
              const SizedBox(width: 15),
              Expanded(child: Text(user['fullName'], style: const TextStyle(fontWeight: FontWeight.bold))),
              Text('${user['greenPoints']} P', style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold)),
            ],
          ),
        );
      },
    );
  }
}
