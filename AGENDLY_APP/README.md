# 🗓️ Agendly App - Flutter

Aplicación móvil profesional para gestión de citas y negocios, construida con **Clean Architecture** siguiendo el estilo de Fernando Herrera.

## 📁 Estructura del Proyecto

```
lib/
├── config/
│   ├── constants/
│   │   └── environment.dart          # Variables de entorno
│   ├── router/
│   │   └── app_router.dart           # Navegación con GoRouter
│   └── theme/
│       ├── app_theme.dart            # Tema dinámico
│       ├── app_text_styles.dart      # Estilos de texto globales
│       └── theme_provider.dart       # Provider del tema
│
├── features/
│   ├── auth/
│   │   ├── domain/
│   │   │   ├── entities/             # User, Business
│   │   │   ├── datasources/          # AuthDatasource
│   │   │   └── repositories/         # AuthRepository
│   │   ├── infrastructure/
│   │   │   ├── datasources/          # AuthDatasourceImpl
│   │   │   ├── repositories/         # AuthRepositoryImpl
│   │   │   └── mappers/              # UserMapper, BusinessMapper
│   │   └── presentation/
│   │       ├── providers/            # AuthProvider (Riverpod)
│   │       ├── screens/              # LoginScreen
│   │       └── widgets/              # Componentes reutilizables
│   │
│   ├── agenda/                       # Feature de citas
│   ├── business/                     # Feature de negocio
│   ├── marketing/                    # Feature de marketing
│   │
│   └── shared/
│       ├── infrastructure/
│       │   └── services/
│       │       ├── dio_client.dart           # Cliente HTTP con interceptores
│       │       ├── socket_service.dart       # Socket.IO para real-time
│       │       ├── firebase_messaging_service.dart  # FCM
│       │       └── key_value_storage_service.dart   # Secure Storage
│       └── presentation/
│           ├── screens/              # SplashScreen, HomeScreen
│           └── widgets/              # Widgets compartidos
│
└── main.dart                         # Entry point
```

## 🚀 Características Principales

### ✅ Implementado

1. **Clean Architecture**
   - Separación por features (auth, agenda, business, marketing)
   - Cada feature con domain, infrastructure y presentation
   - Inyección de dependencias con Riverpod

2. **Branding Dinámico**
   - Los colores del tema se cargan desde el backend al hacer login
   - El `AppTheme` se actualiza automáticamente con los colores del negocio
   - Colores persistidos en Secure Storage

3. **Autenticación Completa**
   - Login con email/password
   - Token JWT almacenado de forma segura
   - Auto-login al abrir la app
   - Logout con limpieza de datos

4. **Servicios Robustos**
   - **DioClient**: Cliente HTTP con interceptores para auth, logging y manejo de errores
   - **SocketService**: Conexión Socket.IO para actualizaciones en tiempo real
   - **FirebaseMessagingService**: Push notifications con FCM
   - **KeyValueStorageService**: Almacenamiento seguro con flutter_secure_storage

5. **Manejo de Errores Backend-Driven**
   - Interceptor que captura mensajes del servidor
   - SnackBars automáticos con mensajes de error
   - Manejo de diferentes códigos HTTP (401, 403, 404, 500, etc.)

6. **Navegación con GoRouter**
   - Rutas protegidas según estado de autenticación
   - Redirección automática
   - Deep linking preparado

## 🔧 Configuración

### 1. Requisitos Previos

```bash
flutter --version  # Flutter 3.5.4 o superior
dart --version     # Dart 3.5.4 o superior
```

### 2. Instalación

```bash
cd AGENDLY_APP
flutter pub get
```

### 3. Configurar Backend

Edita `lib/config/constants/environment.dart`:

```dart
static String apiUrl = 'http://TU_IP:3000/api';  // Cambia TU_IP
static String socketUrl = 'http://TU_IP:3000';
```

**Para iOS Simulator:**
```dart
static String apiUrl = 'http://localhost:3000/api';
```

**Para Android Emulator:**
```dart
static String apiUrl = 'http://10.0.2.2:3000/api';
```

**Para dispositivo físico:**
```dart
static String apiUrl = 'http://192.168.1.X:3000/api';  // Tu IP local
```

### 4. Configurar Firebase (Opcional)

Si quieres usar notificaciones push:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Descarga `google-services.json` (Android) y `GoogleService-Info.plist` (iOS)
3. Colócalos en:
   - Android: `android/app/google-services.json`
   - iOS: `ios/Runner/GoogleService-Info.plist`

### 5. Ejecutar

```bash
# iOS
flutter run -d ios

# Android
flutter run -d android

# Especificar API URL en runtime
flutter run --dart-define=API_URL=http://192.168.1.5:3000/api
```

## 🎨 Branding Dinámico - Cómo Funciona

### Flujo de Colores

```
1. Usuario hace login
   ↓
2. Backend responde con:
   {
     token: "...",
     user: {...},
     business: {
       primaryColor: "#0284C7",
       secondaryColor: "#0EA5E9"
     }
   }
   ↓
3. AuthProvider guarda colores en Secure Storage
   ↓
4. ThemeProvider carga colores y actualiza el tema
   ↓
5. MaterialApp.router aplica el nuevo tema
   ↓
6. Toda la app refleja los colores del negocio
```

### Personalización

```dart
// En tu backend, devuelve colores personalizados:
{
  "primaryColor": "#FF6B6B",    // Rojo
  "secondaryColor": "#4ECDC4"   // Turquesa
}

// La app automáticamente usará estos colores en:
// - AppBar
// - Botones
// - Inputs
// - FAB
// - Chips
// - etc.
```

## 📡 Integraciones

### Socket.IO - Tiempo Real

```dart
// El servicio se conecta automáticamente al hacer login
SocketService().onAppointmentCreated((data) {
  print('Nueva cita: $data');
  // Actualizar UI
});

SocketService().onAppointmentCancelled((data) {
  print('Cita cancelada: $data');
  // Actualizar UI
});
```

### Firebase Cloud Messaging

```dart
// El token FCM se envía automáticamente al backend
// Puedes recibir notificaciones de:
// - Nuevas citas
// - Recordatorios
// - Cancelaciones
// - Actualizaciones de staff
```

## 🧪 Credenciales de Prueba

Usa las credenciales del seed del backend:

```
Email: admin@clinica-elite.com
Password: Password123!
```

## 📦 Dependencias Principales

```yaml
# State Management
flutter_riverpod: ^2.5.1

# HTTP & API
dio: ^5.4.0

# Storage
flutter_secure_storage: ^9.0.0
shared_preferences: ^2.2.2

# Real-time
socket_io_client: ^2.0.3+1

# Firebase
firebase_core: ^2.24.2
firebase_messaging: ^14.7.9

# UI
fl_chart: ^0.66.0
table_calendar: ^3.0.9
google_fonts: ^6.1.0

# Navigation
go_router: ^13.0.0
```

## 🎯 Próximos Pasos

### Features Pendientes

1. **Agenda**
   - Pantalla de calendario con `table_calendar`
   - Crear/editar citas
   - Vista de horarios disponibles
   - Filtros por staff/servicio

2. **Dashboard**
   - Gráficas con `fl_chart`
   - Métricas de negocio
   - Reportes

3. **Marketing**
   - Visualización de QR
   - Compartir link de reserva
   - Deep links

4. **Business**
   - Gestión de staff
   - Gestión de servicios
   - Configuración de negocio

## 🏗️ Arquitectura

### Clean Architecture

```
Presentation Layer (UI)
    ↓ usa
Domain Layer (Business Logic)
    ↓ define contratos
Infrastructure Layer (Data)
```

### Principios Aplicados

- **Separation of Concerns**: Cada capa tiene una responsabilidad única
- **Dependency Inversion**: Las capas superiores no dependen de las inferiores
- **Single Responsibility**: Cada clase tiene una única razón para cambiar
- **Testability**: Fácil de testear por la separación de capas

## 🔐 Seguridad

- JWT almacenado en `flutter_secure_storage`
- Tokens encriptados en el dispositivo
- Interceptor que agrega automáticamente el token a las peticiones
- Auto-logout en caso de token inválido (401)

## 🎨 UI/UX

- **Material Design 3**
- **Fuentes**: Montserrat (headings) + Inter (body)
- **Colores dinámicos** según el negocio
- **Animaciones** suaves
- **Responsive** para tablets

## 📱 Plataformas Soportadas

- ✅ iOS (11.0+)
- ✅ Android (API 21+)
- ⚠️ Web (limitado por secure_storage)
- ⚠️ macOS/Windows/Linux (no probado)

## 🐛 Troubleshooting

### Error: "Connection refused"
- Verifica que el backend esté corriendo
- Usa la IP correcta según tu plataforma (localhost, 10.0.2.2, o IP local)

### Error: "No Firebase App"
- Firebase es opcional, comenta las líneas de Firebase en `main.dart` si no lo usas

### Error: "Secure Storage"
- En iOS Simulator puede fallar, usa dispositivo real o configura keychain

## 📄 Licencia

Este proyecto es parte de Agendly - Sistema de gestión de citas profesional.

---

**Desarrollado con ❤️ usando Clean Architecture y Flutter**
