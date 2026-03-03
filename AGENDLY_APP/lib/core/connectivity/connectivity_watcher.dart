import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:agendly_app/core/connectivity/connectivity_service.dart';
import 'package:agendly_app/core/notifications/notification_service.dart';

/// Observa cambios de conectividad y muestra notificaciones.
/// Solo se modifica aquí si se cambia el comportamiento de las alertas.
class ConnectivityWatcher {
  static void watch(WidgetRef ref) {
    ref.listen<AsyncValue<List<ConnectivityResult>>>(
      connectivityResultsProvider,
      (previous, next) {
        final results = next.value ?? [];
        final isDisconnected = results.contains(ConnectivityResult.none);
        final wasDisconnected =
            previous?.value?.contains(ConnectivityResult.none) ?? false;

        if (isDisconnected) {
          ref.read(notificationProvider.notifier).notify(
                '🔴 Sin conexión a Internet.',
                type: NotificationType.error,
                duration: const Duration(seconds: 5),
              );
        } else if (wasDisconnected && !isDisconnected) {
          ref.read(notificationProvider.notifier).notify(
                '🟢 Conexión restaurada. Sincronizando...',
                type: NotificationType.success,
                duration: const Duration(seconds: 3),
              );
        }
      },
    );
  }
}
