import 'dart:developer' as dev;
import 'package:firebase_messaging/firebase_messaging.dart';

class FirebaseMessagingService {
  final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;

  // Singleton
  static final FirebaseMessagingService _instance = FirebaseMessagingService._internal();
  factory FirebaseMessagingService() => _instance;
  FirebaseMessagingService._internal();

  Future<void> initialize() async {
    // Solicitar permisos
    NotificationSettings settings = await _firebaseMessaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
      provisional: false,
    );

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      dev.log('✅ Permisos de notificaciones concedidos', name: 'FirebaseMessaging');
    } else {
      dev.log('❌ Permisos de notificaciones denegados', name: 'FirebaseMessaging');
    }

    // Configurar handlers
    _configureForegroundNotifications();
    _configureBackgroundNotifications();
  }

  Future<String?> getToken() async {
    try {
      final token = await _firebaseMessaging.getToken();
      dev.log('📱 FCM Token: $token', name: 'FirebaseMessaging');
      return token;
    } catch (e) {
      dev.log('❌ Error obteniendo FCM token: $e', name: 'FirebaseMessaging');
      return null;
    }
  }

  void _configureForegroundNotifications() {
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      dev.log('📬 Notificación recibida en foreground', name: 'FirebaseMessaging');
      dev.log('Título: ${message.notification?.title}', name: 'FirebaseMessaging');
      dev.log('Cuerpo: ${message.notification?.body}', name: 'FirebaseMessaging');
      dev.log('Data: ${message.data}', name: 'FirebaseMessaging');

      // Aquí puedes mostrar una notificación local o un SnackBar
      _handleNotification(message);
    });
  }

  void _configureBackgroundNotifications() {
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      dev.log('📬 Notificación abierta desde background', name: 'FirebaseMessaging');
      dev.log('Data: ${message.data}', name: 'FirebaseMessaging');
      
      // Navegar a la pantalla correspondiente según el tipo
      _handleNotificationNavigation(message);
    });
  }

  void _handleNotification(RemoteMessage message) {
    final data = message.data;
    final type = data['type'];

    switch (type) {
      case 'appointment-created':
        dev.log('🗓️ Nueva cita creada', name: 'FirebaseMessaging');
        break;
      case 'appointment-cancelled':
        dev.log('❌ Cita cancelada', name: 'FirebaseMessaging');
        break;
      case 'appointment-reminder':
        dev.log('⏰ Recordatorio de cita', name: 'FirebaseMessaging');
        break;
      case 'staff-created':
        dev.log('👥 Nuevo staff agregado', name: 'FirebaseMessaging');
        break;
      default:
        dev.log('📬 Notificación genérica', name: 'FirebaseMessaging');
    }
  }

  void _handleNotificationNavigation(RemoteMessage message) {
    final data = message.data;
    final type = data['type'];

    // Aquí implementarás la navegación según el tipo
    // Ejemplo: navigatorKey.currentState?.pushNamed('/appointments');
    
    dev.log('🧭 Navegando por notificación tipo: $type', name: 'FirebaseMessaging');
  }

  // Listener para cambios en el token
  void onTokenRefresh(Function(String) callback) {
    _firebaseMessaging.onTokenRefresh.listen(callback);
  }

  // Suscribirse a un topic
  Future<void> subscribeToTopic(String topic) async {
    await _firebaseMessaging.subscribeToTopic(topic);
    dev.log('📢 Suscrito al topic: $topic', name: 'FirebaseMessaging');
  }

  // Desuscribirse de un topic
  Future<void> unsubscribeFromTopic(String topic) async {
    await _firebaseMessaging.unsubscribeFromTopic(topic);
    dev.log('📢 Desuscrito del topic: $topic', name: 'FirebaseMessaging');
  }
}

// Handler para notificaciones en background (debe ser top-level function)
@pragma('vm:entry-point')
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  dev.log('📬 Notificación recibida en background', name: 'FirebaseMessaging');
  dev.log('Título: ${message.notification?.title}', name: 'FirebaseMessaging');
  dev.log('Data: ${message.data}', name: 'FirebaseMessaging');
}
