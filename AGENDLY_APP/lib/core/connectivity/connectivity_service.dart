import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Servicio que encapsula connectivity_plus.
/// Si se cambia la librería de conectividad, solo se modifica este archivo.
class ConnectivityService {
  final Connectivity _connectivity = Connectivity();

  /// Stream raw de cambios de conectividad (para ConnectivityWatcher)
  Stream<List<ConnectivityResult>> get onConnectivityChanged =>
      _connectivity.onConnectivityChanged;

  /// Stream que simplifica a un booleano: true = conectado, false = desconectado
  Stream<bool> get internetStatusStream =>
      _connectivity.onConnectivityChanged.map((results) {
        return !results.contains(ConnectivityResult.none);
      });
}

final connectivityServiceProvider = Provider<ConnectivityService>((ref) {
  return ConnectivityService();
});

/// Provider que expone solo el booleano: true = conectado, false = desconectado
final isConnectedProvider = StreamProvider<bool>((ref) {
  return ref.watch(connectivityServiceProvider).internetStatusStream;
});

/// Provider raw para ConnectivityWatcher (lista de resultados)
final connectivityResultsProvider = StreamProvider<List<ConnectivityResult>>((ref) {
  return ref.watch(connectivityServiceProvider).onConnectivityChanged;
});
