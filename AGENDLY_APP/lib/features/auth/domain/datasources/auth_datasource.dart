import 'package:agendly_app/features/auth/domain/entities/user.dart';

abstract class AuthDatasource {
  Future<Map<String, dynamic>> login(String email, String password);
  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String name,
    required String businessName,
  });
  Future<User> checkAuthStatus(String token);
  Future<void> updateFcmToken(String token);
}
