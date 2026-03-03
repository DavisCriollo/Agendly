# 🏗️ Arquitectura de Agendly App

## Clean Architecture - Estilo Fernando Herrera

### Capas de la Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Screens, Widgets, Providers (Riverpod)          │  │
│  │  - LoginScreen                                    │  │
│  │  - AuthProvider (StateNotifier)                   │  │
│  │  - ThemeProvider                                  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                        ↓ usa
┌─────────────────────────────────────────────────────────┐
│                    DOMAIN LAYER                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Entities, Repositories (abstract), Datasources  │  │
│  │  - User, Business (entities)                      │  │
│  │  - AuthRepository (abstract)                      │  │
│  │  - AuthDatasource (abstract)                      │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                        ↓ implementa
┌─────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Repositories (impl), Datasources (impl), Mappers│  │
│  │  - AuthRepositoryImpl                             │  │
│  │  - AuthDatasourceImpl (con Dio)                   │  │
│  │  - UserMapper, BusinessMapper                     │  │
│  │  - DioClient, SocketService, FCM                  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Features Organizados

### 1. Auth Feature

```
auth/
├── domain/
│   ├── entities/
│   │   ├── user.dart                 # Entidad User
│   │   └── business.dart             # Entidad Business
│   ├── datasources/
│   │   └── auth_datasource.dart      # Contrato del datasource
│   └── repositories/
│       └── auth_repository.dart      # Contrato del repository
│
├── infrastructure/
│   ├── datasources/
│   │   └── auth_datasource_impl.dart # Implementación con Dio
│   ├── repositories/
│   │   └── auth_repository_impl.dart # Implementación del repository
│   └── mappers/
│       ├── user_mapper.dart          # JSON <-> User
│       └── business_mapper.dart      # JSON <-> Business
│
└── presentation/
    ├── providers/
    │   └── auth_provider.dart        # StateNotifier + Provider
    ├── screens/
    │   └── login_screen.dart         # Pantalla de login
    └── widgets/
        └── (componentes reutilizables)
```

### 2. Shared (Servicios Compartidos)

```
shared/
├── infrastructure/
│   └── services/
│       ├── dio_client.dart                    # HTTP Client
│       ├── socket_service.dart                # Socket.IO
│       ├── firebase_messaging_service.dart    # FCM
│       ├── key_value_storage_service.dart     # Abstract
│       └── key_value_storage_service_impl.dart # Secure Storage
│
└── presentation/
    ├── screens/
    │   ├── splash_screen.dart
    │   └── home_screen.dart
    └── widgets/
        └── (widgets compartidos)
```

## Flujo de Datos

### Login Flow

```
1. Usuario ingresa email/password en LoginScreen
   ↓
2. LoginScreen llama a authProvider.login()
   ↓
3. AuthNotifier (StateNotifier) ejecuta login
   ↓
4. AuthNotifier usa AuthRepository.login()
   ↓
5. AuthRepositoryImpl delega a AuthDatasource
   ↓
6. AuthDatasourceImpl hace POST con Dio
   ↓
7. Backend responde con { token, user, business }
   ↓
8. UserMapper y BusinessMapper convierten JSON a entities
   ↓
9. AuthNotifier guarda token en SecureStorage
   ↓
10. AuthNotifier guarda colores del business
   ↓
11. AuthNotifier actualiza el state
   ↓
12. ThemeProvider detecta cambio y actualiza tema
   ↓
13. GoRouter detecta auth y navega a home
   ↓
14. SocketService se conecta con el businessId
   ↓
15. FirebaseMessaging envía FCM token al backend
```

## Providers (Riverpod)

### Jerarquía de Providers

```dart
// 1. Storage Service (base)
final keyValueStorageServiceProvider = Provider<KeyValueStorageService>

// 2. Auth Repository (usa Dio)
final authRepositoryProvider = Provider<AuthRepository>

// 3. Auth State (usa Repository + Storage)
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>

// 4. Theme (usa Storage)
final themeProvider = StateNotifierProvider<ThemeNotifier, AppTheme>

// 5. Router (usa Auth State)
final appRouterProvider = Provider<GoRouter>
```

### Estado de Autenticación

```dart
enum AuthStatus {
  checking,           // Verificando token
  authenticated,      // Usuario autenticado
  notAuthenticated,   // No autenticado
}

class AuthState {
  final AuthStatus status;
  final User? user;
  final Business? business;
  final String? errorMessage;
}
```

## Interceptores de Dio

### 1. AuthInterceptor
- Agrega automáticamente el token JWT a todas las peticiones
- Lee el token desde SecureStorage

### 2. LoggerInterceptor
- Imprime requests, responses y errores
- Útil para debugging

### 3. ErrorInterceptor
- Captura errores de Dio
- Convierte códigos HTTP en mensajes amigables
- Extrae mensajes del backend
- Maneja timeouts y errores de conexión

## Servicios en Tiempo Real

### Socket.IO Service

```dart
// Singleton pattern
SocketService()
  .connect(businessId, token: token)
  .onAppointmentCreated((data) { ... })
  .onAppointmentCancelled((data) { ... })
  .disconnect()
```

**Eventos Soportados:**
- `appointment-created`
- `appointment-updated`
- `appointment-cancelled`
- `staff-created`
- `staff-updated`
- `client-created`

### Firebase Messaging Service

```dart
// Singleton pattern
FirebaseMessagingService()
  .initialize()
  .getToken()
  .onTokenRefresh((token) { ... })
  .subscribeToTopic('business-123')
```

**Handlers:**
- Foreground: Muestra notificación local
- Background: Handler top-level
- Opened: Navega a pantalla correspondiente

## Tema Dinámico

### Flujo de Branding

```
1. Login exitoso con business data
   ↓
2. AuthProvider guarda primaryColor y secondaryColor
   ↓
3. ThemeProvider lee colores desde storage
   ↓
4. ThemeProvider crea AppTheme.fromBusiness()
   ↓
5. AppTheme genera ThemeData con colores del negocio
   ↓
6. MaterialApp.router aplica el tema
   ↓
7. Todos los widgets usan los colores automáticamente
```

### Componentes Afectados

- AppBar
- Buttons (Elevated, Text, Outlined)
- Inputs
- Cards
- Chips
- FAB
- Bottom Navigation
- Progress Indicators

## Navegación (GoRouter)

### Rutas Protegidas

```dart
redirect: (context, state) {
  // Si está verificando, mostrar splash
  if (checking) return '/splash';
  
  // Si no está autenticado, ir a login
  if (notAuthenticated) return '/login';
  
  // Si está autenticado y va a login, ir a home
  if (authenticated && goingToLogin) return '/';
  
  return null; // Permitir navegación
}
```

### Rutas Definidas

- `/splash` - Pantalla de carga
- `/login` - Inicio de sesión
- `/register` - Registro
- `/` - Home (Dashboard)

## Manejo de Errores

### Backend-Driven UI

```dart
// El backend devuelve:
{
  "success": false,
  "error": {
    "message": "Email ya registrado",
    "code": "EMAIL_EXISTS"
  }
}

// ErrorInterceptor lo captura y muestra:
ScaffoldMessenger.of(context).showSnackBar(
  SnackBar(
    content: Text("Email ya registrado"),
    backgroundColor: Colors.red,
  ),
);
```

### Códigos HTTP Manejados

- `400` - Solicitud inválida
- `401` - No autorizado (auto-logout)
- `403` - Acceso denegado
- `404` - Recurso no encontrado
- `500` - Error del servidor
- `503` - Servicio no disponible
- `Timeout` - Tiempo de espera agotado
- `Connection Error` - Sin internet

## Seguridad

### Almacenamiento Seguro

```dart
// Token JWT
await storage.setKeyValue('token', token);

// Colores del negocio
await storage.setKeyValue('primaryColor', '#0284C7');
await storage.setKeyValue('secondaryColor', '#0EA5E9');

// Limpieza al logout
await storage.clearAll();
```

### Encriptación

- iOS: Keychain
- Android: EncryptedSharedPreferences
- Datos encriptados en reposo

## Testing (Preparado)

### Unit Tests

```dart
// Testear mappers
test('UserMapper convierte JSON a User', () {
  final json = {...};
  final user = UserMapper.fromJson(json);
  expect(user.email, 'test@test.com');
});

// Testear providers
test('AuthNotifier hace login correctamente', () async {
  final container = ProviderContainer();
  await container.read(authProvider.notifier).login(...);
  expect(container.read(authProvider).status, AuthStatus.authenticated);
});
```

### Widget Tests

```dart
testWidgets('LoginScreen muestra formulario', (tester) async {
  await tester.pumpWidget(
    ProviderScope(child: MaterialApp(home: LoginScreen())),
  );
  expect(find.byType(TextFormField), findsNWidgets(2));
});
```

## Performance

### Optimizaciones Aplicadas

1. **Lazy Loading**: Providers se crean solo cuando se necesitan
2. **Singleton**: Services (Socket, FCM) son singleton
3. **Caching**: Colores del tema en storage
4. **Debouncing**: En inputs de búsqueda (cuando se implemente)
5. **Pagination**: Preparado para listas grandes

## Escalabilidad

### Agregar un Nuevo Feature

```bash
# 1. Crear estructura
mkdir -p lib/features/nuevo_feature/{domain,infrastructure,presentation}/{entities,datasources,repositories,mappers,providers,screens,widgets}

# 2. Crear entidad
lib/features/nuevo_feature/domain/entities/mi_entidad.dart

# 3. Crear datasource (abstract)
lib/features/nuevo_feature/domain/datasources/mi_datasource.dart

# 4. Crear repository (abstract)
lib/features/nuevo_feature/domain/repositories/mi_repository.dart

# 5. Implementar datasource
lib/features/nuevo_feature/infrastructure/datasources/mi_datasource_impl.dart

# 6. Implementar repository
lib/features/nuevo_feature/infrastructure/repositories/mi_repository_impl.dart

# 7. Crear mapper
lib/features/nuevo_feature/infrastructure/mappers/mi_mapper.dart

# 8. Crear provider
lib/features/nuevo_feature/presentation/providers/mi_provider.dart

# 9. Crear screen
lib/features/nuevo_feature/presentation/screens/mi_screen.dart
```

---

**Esta arquitectura garantiza:**
- ✅ Código mantenible
- ✅ Fácil de testear
- ✅ Escalable
- ✅ Desacoplado
- ✅ Reutilizable
