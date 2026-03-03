/// Abstracción del servicio de red.
/// Permite cambiar la implementación (Dio, http, etc.) en un solo lugar.
abstract class NetworkService {
  Future<dynamic> get(
    String url, {
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
  });

  Future<dynamic> post(
    String url, {
    dynamic data,
    Map<String, String>? headers,
  });

  Future<dynamic> put(
    String url, {
    dynamic data,
    Map<String, String>? headers,
  });

  Future<dynamic> delete(
    String url, {
    Map<String, String>? headers,
  });
}
