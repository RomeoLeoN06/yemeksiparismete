import 'package:signalr_netcore/signalr_client.dart';
import 'auth_service.dart';
import 'api_constants.dart';

class GroupOrderService {
  HubConnection? _hubConnection;
  final AuthService _authService = AuthService();

  Future<void> initHub({
    required Function(String code, int sessionId, String creatorId) onGroupCreated,
    required Function(List<dynamic> items, int sessionId) onCartUpdated,
    required Function(int orderId) onGroupOrderCompleted,
    required Function(String message) onGroupDisbanded,
    required Function(String error) onError,
  }) async {
    final token = await _authService.getToken();
    if (token == null) return;

    final hubUrl = ApiConstants.baseUrl.replaceFirst('/api', '/grouporderhub');
    
    _hubConnection = HubConnectionBuilder()
        .withUrl(hubUrl, options: HttpConnectionOptions(
          accessTokenFactory: () async => token,
        ))
        .withAutomaticReconnect()
        .build();

    _hubConnection!.on("GroupCreated", (arguments) {
      if (arguments != null && arguments.length >= 3) {
        onGroupCreated(
          arguments[0].toString(), 
          (arguments[1] as num).toInt(),
          arguments[2].toString()
        );
      }
    });

    _hubConnection!.on("SyncCart", (arguments) {
      if (arguments != null && arguments.length >= 3) {
        onCartUpdated(arguments[0] as List<dynamic>, (arguments[2] as num).toInt());
      }
    });

    _hubConnection!.on("CartUpdated", (arguments) {
      if (arguments != null && arguments.isNotEmpty) {
        // Not: CartUpdated sadece sepeti günceller, mevcut sessionId değişmez.
        onCartUpdated(arguments[0] as List<dynamic>, 0); // 0 placeholder
      }
    });

    _hubConnection!.on("GroupOrderCompleted", (arguments) {
      if (arguments != null && arguments.isNotEmpty) {
        onGroupOrderCompleted((arguments[0] as num).toInt());
      }
    });

    _hubConnection!.on("GroupDisbanded", (arguments) {
      if (arguments != null && arguments.isNotEmpty) {
        onGroupDisbanded(arguments[0].toString());
      }
    });

    _hubConnection!.on("Error", (arguments) {
      if (arguments != null && arguments.isNotEmpty) {
        onError(arguments[0].toString());
      }
    });

    try {
      await _hubConnection!.start();
      print("SignalR: Connected to GroupOrderHub");
    } catch (e) {
      print("SignalR: Connection failed: $e");
    }
  }

  Future<void> createGroup(int restaurantId, String userId) async {
    if (_hubConnection?.state == HubConnectionState.Connected) {
      await _hubConnection!.invoke("CreateGroup", args: [restaurantId, userId]);
    }
  }

  Future<void> joinGroup(String groupCode) async {
    if (_hubConnection?.state == HubConnectionState.Connected) {
      await _hubConnection!.invoke("JoinGroup", args: [groupCode]);
    }
  }

  Future<void> leaveGroup(String groupCode, String userId) async {
    if (_hubConnection?.state == HubConnectionState.Connected) {
      await _hubConnection!.invoke("LeaveGroup", args: [groupCode, userId]);
    }
  }

  Future<void> addToGroupCart(String groupCode, int productId, String productName, double price, String userId, String userName) async {
    if (_hubConnection?.state == HubConnectionState.Connected) {
      await _hubConnection!.invoke("AddToGroupCart", args: [groupCode, productId, productName, price, userId, userName]);
    }
  }

  Future<void> removeFromGroupCart(String groupCode, int productId, String userId) async {
    if (_hubConnection?.state == HubConnectionState.Connected) {
      await _hubConnection!.invoke("RemoveFromGroupCart", args: [groupCode, productId, userId]);
    }
  }

  void stop() {
    _hubConnection?.stop();
  }
}
