import 'package:flutter_riverpod/flutter_riverpod.dart';

enum NotificationType { error, success, info }

class NotificationMessage {
  final String message;
  final NotificationType type;
  final Duration duration;

  NotificationMessage({
    required this.message,
    required this.type,
    this.duration = const Duration(seconds: 3),
  });
}

/// Notificador para mostrar mensajes en la UI.
/// El NotificationListener debe estar en el árbol de widgets para mostrarlos.
class NotificationNotifier extends StateNotifier<NotificationMessage?> {
  NotificationNotifier() : super(null);

  void notify(
    String message, {
    NotificationType type = NotificationType.info,
    Duration duration = const Duration(seconds: 3),
  }) {
    state = NotificationMessage(
      message: message,
      type: type,
      duration: duration,
    );
  }

  void clear() {
    state = null;
  }
}

final notificationProvider =
    StateNotifierProvider<NotificationNotifier, NotificationMessage?>((ref) {
  return NotificationNotifier();
});
