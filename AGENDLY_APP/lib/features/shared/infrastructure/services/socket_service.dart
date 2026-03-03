import 'dart:developer' as dev;
import 'package:socket_io_client/socket_io_client.dart' as io;
import 'package:agendly_app/config/constants/environment.dart';

class SocketService {
  io.Socket? _socket;
  String? _businessId;

  // Singleton
  static final SocketService _instance = SocketService._internal();
  factory SocketService() => _instance;
  SocketService._internal();

  bool get isConnected => _socket?.connected ?? false;
  String? get businessId => _businessId;

  void connect(String businessId, {String? token}) {
    _businessId = businessId;

    _socket = io.io(
      Environment.socketUrl,
      io.OptionBuilder()
          .setTransports(['websocket'])
          .enableAutoConnect()
          .setExtraHeaders({'authorization': 'Bearer ${token ?? ''}'})
          .build(),
    );

    _socket!.onConnect((_) {
      dev.log('🔌 Socket conectado', name: 'SocketService');
      joinBusiness(businessId);
    });

    _socket!.onDisconnect((_) {
      dev.log('🔌 Socket desconectado', name: 'SocketService');
    });

    _socket!.onConnectError((error) {
      dev.log('❌ Error de conexión Socket: $error', name: 'SocketService');
    });

    _socket!.connect();
  }

  void joinBusiness(String businessId) {
    if (_socket?.connected ?? false) {
      _socket!.emit('join-business', businessId);
      dev.log('🏢 Unido al negocio: $businessId', name: 'SocketService');
    }
  }

  void disconnect() {
    if (_socket?.connected ?? false) {
      _socket!.disconnect();
      _socket = null;
      _businessId = null;
    }
  }

  // Escuchar eventos de citas
  void onAppointmentCreated(Function(dynamic) callback) {
    _socket?.on('appointment-created', callback);
  }

  void onAppointmentUpdated(Function(dynamic) callback) {
    _socket?.on('appointment-updated', callback);
  }

  void onAppointmentCancelled(Function(dynamic) callback) {
    _socket?.on('appointment-cancelled', callback);
  }

  // Escuchar eventos de staff
  void onStaffCreated(Function(dynamic) callback) {
    _socket?.on('staff-created', callback);
  }

  void onStaffUpdated(Function(dynamic) callback) {
    _socket?.on('staff-updated', callback);
  }

  // Escuchar eventos de clientes
  void onClientCreated(Function(dynamic) callback) {
    _socket?.on('client-created', callback);
  }

  // Remover listeners
  void removeListener(String event) {
    _socket?.off(event);
  }

  void removeAllListeners() {
    _socket?.clearListeners();
  }
}
