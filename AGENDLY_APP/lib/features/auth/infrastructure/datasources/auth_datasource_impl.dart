import 'dart:developer' as dev;
import 'package:dio/dio.dart';
import 'package:agendly_app/features/auth/domain/datasources/auth_datasource.dart';
import 'package:agendly_app/features/auth/domain/entities/user.dart';
import 'package:agendly_app/features/auth/infrastructure/mappers/user_mapper.dart';

class AuthDatasourceImpl extends AuthDatasource {
  final Dio dio;

  AuthDatasourceImpl(this.dio);

  @override
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await dio.post(
        '/auth/login',
        data: {
          'email': email,
          'password': password,
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = response.data;
        
        // El backend devuelve: { success: true, data: { token, user, business } }
        if (data['success'] == true) {
          return data['data'];
        }
        
        throw Exception('Error en el formato de respuesta');
      }

      throw Exception('Error en login');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String name,
    required String businessName,
  }) async {
    try {
      final response = await dio.post(
        '/auth/register',
        data: {
          'email': email,
          'password': password,
          'name': name,
          'businessName': businessName,
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = response.data;
        
        if (data['success'] == true) {
          return data['data'];
        }
        
        throw Exception('Error en el formato de respuesta');
      }

      throw Exception('Error en registro');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<User> checkAuthStatus(String token) async {
    try {
      final response = await dio.get(
        '/auth/check-status',
        options: Options(
          headers: {'Authorization': 'Bearer $token'},
        ),
      );

      if (response.statusCode == 200) {
        final data = response.data;
        return UserMapper.fromJson(data['user']);
      }

      throw Exception('Token inválido');
    } on DioException catch (e) {
      throw Exception(e.error ?? 'Error de conexión');
    }
  }

  @override
  Future<void> updateFcmToken(String token) async {
    try {
      await dio.patch(
        '/auth/fcm-token',
        data: {'fcmToken': token},
      );
    } on DioException catch (e) {
      dev.log('Error actualizando FCM token: ${e.error}', name: 'AuthDatasource');
    }
  }
}
