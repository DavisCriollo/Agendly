import 'dart:developer' as dev;
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:agendly_app/config/constants/environment.dart';
import 'package:agendly_app/features/shared/infrastructure/services/key_value_storage_service.dart';
import 'package:agendly_app/features/shared/infrastructure/services/key_value_storage_service_impl.dart';

class DioClient {
  late final Dio _dio;
  final KeyValueStorageService _storageService;

  DioClient(this._storageService) {
    _dio = Dio(
      BaseOptions(
        baseUrl: Environment.apiUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Source': 'mobile-flutter',
        },
      ),
    );

    _dio.interceptors.add(_AuthInterceptor(_storageService));
    _dio.interceptors.add(_LoggerInterceptor());
    _dio.interceptors.add(_ErrorInterceptor());
  }

  Dio get dio => _dio;
}

// Interceptor para agregar el token JWT
class _AuthInterceptor extends Interceptor {
  final KeyValueStorageService _storageService;

  _AuthInterceptor(this._storageService);

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await _storageService.getValue<String>('token');
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }
}

// Interceptor para logging
class _LoggerInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    dev.log('🌐 REQUEST[${options.method}] => PATH: ${options.path}', name: 'DioClient');
    dev.log('📦 DATA: ${options.data}', name: 'DioClient');
    handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    dev.log('✅ RESPONSE[${response.statusCode}] => PATH: ${response.requestOptions.path}', name: 'DioClient');
    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    dev.log('❌ ERROR[${err.response?.statusCode}] => PATH: ${err.requestOptions.path}', name: 'DioClient');
    dev.log('💥 MESSAGE: ${err.message}', name: 'DioClient');
    handler.next(err);
  }
}

// Interceptor para manejo de errores
class _ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    String errorMessage = 'Error desconocido';

    switch (err.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        errorMessage = 'Tiempo de espera agotado. Verifica tu conexión.';
        break;
      case DioExceptionType.badResponse:
        errorMessage = _handleStatusCode(err.response?.statusCode);
        // Intentar extraer mensaje del servidor
        if (err.response?.data != null) {
          final data = err.response!.data;
          if (data is Map<String, dynamic>) {
            errorMessage = data['message'] ?? 
                          data['error']?['message'] ?? 
                          errorMessage;
          }
        }
        break;
      case DioExceptionType.cancel:
        errorMessage = 'Solicitud cancelada';
        break;
      case DioExceptionType.unknown:
        errorMessage = 'Error de conexión. Verifica tu internet.';
        break;
      default:
        errorMessage = 'Error desconocido';
    }

    // Crear un nuevo error con el mensaje personalizado
    final customError = DioException(
      requestOptions: err.requestOptions,
      response: err.response,
      type: err.type,
      error: errorMessage,
    );

    handler.next(customError);
  }

  String _handleStatusCode(int? statusCode) {
    switch (statusCode) {
      case 400:
        return 'Solicitud inválida';
      case 401:
        return 'No autorizado. Inicia sesión nuevamente.';
      case 403:
        return 'Acceso denegado';
      case 404:
        return 'Recurso no encontrado';
      case 500:
        return 'Error del servidor';
      case 503:
        return 'Servicio no disponible';
      default:
        return 'Error en la solicitud';
    }
  }
}

// Provider para Dio
final dioProvider = Provider<Dio>((ref) {
  final storageService = ref.watch(keyValueStorageServiceProvider);
  final dioClient = DioClient(storageService);
  return dioClient.dio;
});

// Provider del Storage Service
final keyValueStorageServiceProvider = Provider<KeyValueStorageService>((ref) {
  return KeyValueStorageServiceImpl();
});
