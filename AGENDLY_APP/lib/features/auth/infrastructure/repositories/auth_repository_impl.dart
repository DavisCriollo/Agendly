import 'package:agendly_app/features/auth/domain/datasources/auth_datasource.dart';
import 'package:agendly_app/features/auth/domain/entities/user.dart';
import 'package:agendly_app/features/auth/domain/repositories/auth_repository.dart';

class AuthRepositoryImpl extends AuthRepository {
  final AuthDatasource datasource;

  AuthRepositoryImpl(this.datasource);

  @override
  Future<Map<String, dynamic>> login(String email, String password) {
    return datasource.login(email, password);
  }

  @override
  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String name,
    required String businessName,
  }) {
    return datasource.register(
      email: email,
      password: password,
      name: name,
      businessName: businessName,
    );
  }

  @override
  Future<User> checkAuthStatus(String token) {
    return datasource.checkAuthStatus(token);
  }

  @override
  Future<void> updateFcmToken(String token) {
    return datasource.updateFcmToken(token);
  }
}
