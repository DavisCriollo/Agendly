import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:agendly_app/core/notifications/notification_service.dart';

/// Widget que escucha las notificaciones y muestra SnackBars.
/// Debe estar dentro del árbol de MaterialApp para que SnackBar funcione.
class NotificationListenerWidget extends ConsumerWidget {
  final Widget child;

  const NotificationListenerWidget({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.listen<NotificationMessage?>(
      notificationProvider,
      (previous, next) {
        if (next != null) {
          _showSnackBar(context, next);
          ref.read(notificationProvider.notifier).clear();
        }
      },
    );
    return child;
  }

  void _showSnackBar(BuildContext context, NotificationMessage message) {
    final color = _getColorForType(message.type);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message.message),
        backgroundColor: color,
        duration: message.duration,
      ),
    );
  }

  Color _getColorForType(NotificationType type) {
    switch (type) {
      case NotificationType.error:
        return Colors.red.shade700;
      case NotificationType.success:
        return Colors.green.shade700;
      case NotificationType.info:
        return Colors.blue.shade700;
    }
  }
}
