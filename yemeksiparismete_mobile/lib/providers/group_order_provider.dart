import 'package:flutter/material.dart';
import '../services/group_order_service.dart';

class GroupOrderProvider with ChangeNotifier {
  final GroupOrderService _service = GroupOrderService();
  
  String? _groupCode;
  String? _creatorId;
  int? _sessionId;
  List<dynamic> _items = [];
  bool _isConnecting = false;

  String? get groupCode => _groupCode;
  String? get creatorId => _creatorId;
  int? get sessionId => _sessionId;
  List<dynamic> get items => _items;
  bool get isConnecting => _isConnecting;

  Future<void> init(String userId) async {
    // Eğer zaten bir gruba bağlıysak ve yeni bir restorana giriyorsak temizleyelim
    if (_groupCode != null) {
       leaveGroup(userId);
    }

    await _service.initHub(
      onGroupCreated: (code, sessionId, creatorId) {
        _groupCode = code;
        _sessionId = sessionId;
        _creatorId = creatorId;
        notifyListeners();
      },
      onCartUpdated: (items, sessionId) {
        _items = items;
        if (sessionId != 0) _sessionId = sessionId;
        if (items.isNotEmpty) {
          _creatorId = items[0]['addedByUserId'] ?? items[0]['AddedByUserId'];
        }
        notifyListeners();
      },
      onGroupOrderCompleted: (orderId) {
        _groupCode = null;
        _creatorId = null;
        _sessionId = null;
        _items = [];
        notifyListeners();
      },
      onGroupDisbanded: (msg) {
        _groupCode = null;
        _creatorId = null;
        _sessionId = null;
        _items = [];
        notifyListeners();
        // UI'da alert gösterimi için bir mekanizma eklenebilir
      },
      onError: (err) {
        print("SignalR Error: $err");
      },
    );
  }

  Future<void> createGroup(int restaurantId, String userId) async {
    _isConnecting = true;
    notifyListeners();
    await _service.createGroup(restaurantId, userId);
    _isConnecting = false;
    notifyListeners();
  }

  Future<void> joinGroup(String code) async {
    await _service.joinGroup(code);
    _groupCode = code;
    notifyListeners();
  }

  Future<void> addToCart(int productId, String productName, double price, String userId, String userName) async {
    if (_groupCode != null) {
      await _service.addToGroupCart(_groupCode!, productId, productName, price, userId, userName);
    }
  }

  Future<void> removeFromCart(int productId, String userId) async {
    if (_groupCode != null) {
      await _service.removeFromGroupCart(_groupCode!, productId, userId);
    }
  }

  Future<void> leaveGroup(String userId) async {
    if (_groupCode != null) {
      await _service.leaveGroup(_groupCode!, userId);
    }
    _groupCode = null;
    _creatorId = null;
    _sessionId = null;
    _items = [];
    notifyListeners();
  }
}
