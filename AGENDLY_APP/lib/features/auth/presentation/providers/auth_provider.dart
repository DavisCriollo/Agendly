import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:agendly_app/features/auth/domain/entities/user.dart';
import 'package:agendly_app/features/auth/domain/entities/business.dart';
import 'package:agendly_app/features/auth/domain/repositories/auth_repository.dart';
import 'package:agendly_app/features/auth/infrastructure/repositories/auth_repository_impl.dart';
import 'package:agendly_app/features/auth/infrastructure/datasources/auth_datasource_impl.dart';
import 'package:agendly_app/features/auth/infrastructure/mappers/user_mapper.dart';
import 'package:agendly_app/features/auth/infrastructure/mappers/business_mapper.dart';
import 'package:agendly_app/features/shared/infrastructure/services/dio_client.dart';
import 'package:agendly_app/features/shared/infrastructure/services/key_value_storage_service.dart';
import 'package:agendly_app/features/shared/infrastructure/services/key_value_storage_service_impl.dart';
import 'package:agendly_app/features/shared/infrastructure/services/socket_service.dart';
import 'package:agendly_app/features/shared/infrastructure/services/firebase_messaging_service.dart';

// Provider del Storage Service
final keyValueStorageServiceProvider = Provider<KeyValueStorageService>((ref) {
  return KeyValueStorageServiceImpl();
});

// Provider del Auth Repository
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final storageService = ref.watch(keyValueStorageServiceProvider);
  final dioClient = DioClient(storageService);
  final datasource = AuthDatasourceImpl(dioClient.dio);
  return AuthRepositoryImpl(datasource);
});

// Estado de autenticación
enum AuthStatus { checking, authenticated, notAuthenticated }

class AuthState {
  final AuthStatus status;
  final User? user;
  final Business? business;
  final String? errorMessage;

  AuthState({
    this.status = AuthStatus.checking,
    this.user,
    this.business,
    this.errorMessage,
  });

  AuthState copyWith({
    AuthStatus? status,
    User? user,
    Business? business,
    String? errorMessage,
  }) {
    return AuthState(
      status: status ?? this.status,
      user: user ?? this.user,
      business: business ?? this.business,
      errorMessage: errorMessage,
    );
  }
}

// StateNotifier para Auth
class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository authRepository;
  final KeyValueStorageService storageService;

  AuthNotifier({
    required this.authRepository,
    required this.storageService,
  }) : super(AuthState()) {
    checkAuthStatus();
  }

  Future<void> checkAuthStatus() async {
    final token = await storageService.getValue<String>('token');

    if (token == null) {
      state = state.copyWith(status: AuthStatus.notAuthenticated);
      return;
    }

    try {
      final user = await authRepository.checkAuthStatus(token);
      
      // Obtener business y colores guardados
      final businessJson = await storageService.getValue<String>('business');
      Business? business;
      if (businessJson != null) {
        // Aquí deberías deserializar el JSON, por simplicidad:
        business = null; // Implementar deserialización
      }

      state = state.copyWith(
        status: AuthStatus.authenticated,
        user: user,
        business: business,
      );

      // Conectar socket
      if (user.businessId != null) {
        SocketService().connect(user.businessId!, token: token);
      }
    } catch (e) {
      await logout();
    }
  }

  Future<void> login(String email, String password) async {
    try {
      final response = await authRepository.login(email, password);
      
      final token = response['token'];
      final userJson = response['user'];
      final businessJson = response['business'];

      // Guardar token
      await storageService.setKeyValue('token', token);
      
      // Mapear entidades
      final user = UserMapper.fromJson(userJson);
      final business = businessJson != null 
          ? BusinessMapper.fromJson(businessJson) 
          : null;

      // Guardar business para los colores
      if (business != null) {
        await storageService.setKeyValue('primaryColor', business.primaryColor);
        await storageService.setKeyValue('secondaryColor', business.secondaryColor);
      }

      state = state.copyWith(
        status: AuthStatus.authenticated,
        user: user,
        business: business,
        errorMessage: null,
      );

      // Conectar socket
      if (user.businessId != null) {
        SocketService().connect(user.businessId!, token: token);
      }

      // Actualizar FCM token
      final fcmToken = await FirebaseMessagingService().getToken();
      if (fcmToken != null) {
        await authRepository.updateFcmToken(fcmToken);
      }
    } catch (e) {
      state = state.copyWith(
        status: AuthStatus.notAuthenticated,
        errorMessage: e.toString(),
      );
      rethrow;
    }
  }

  Future<void> register({
    required String email,
    required String password,
    required String name,
    required String businessName,
  }) async {
    try {
      final response = await authRepository.register(
        email: email,
        password: password,
        name: name,
        businessName: businessName,
      );

      final token = response['token'];
      final userJson = response['user'];
      final businessJson = response['business'];

      await storageService.setKeyValue('token', token);
      
      final user = UserMapper.fromJson(userJson);
      final business = businessJson != null 
          ? BusinessMapper.fromJson(businessJson) 
          : null;

      if (business != null) {
        await storageService.setKeyValue('primaryColor', business.primaryColor);
        await storageService.setKeyValue('secondaryColor', business.secondaryColor);
      }

      state = state.copyWith(
        status: AuthStatus.authenticated,
        user: user,
        business: business,
        errorMessage: null,
      );

      if (user.businessId != null) {
        SocketService().connect(user.businessId!, token: token);
      }
    } catch (e) {
      state = state.copyWith(
        status: AuthStatus.notAuthenticated,
        errorMessage: e.toString(),
      );
      rethrow;
    }
  }

  Future<void> logout() async {
    await storageService.clearAll();
    SocketService().disconnect();
    state = state.copyWith(
      status: AuthStatus.notAuthenticated,
      user: null,
      business: null,
    );
  }
}

// Provider del AuthNotifier
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final authRepository = ref.watch(authRepositoryProvider);
  final storageService = ref.watch(keyValueStorageServiceProvider);

  return AuthNotifier(
    authRepository: authRepository,
    storageService: storageService,
  );
});
