# 🔌 Integración con el Backend

## Configuración de Conexión

### 1. Identificar tu IP Local

**macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```bash
ipconfig
```

Busca algo como: `192.168.1.5` o `192.168.0.10`

### 2. Configurar según Plataforma

#### iOS Simulator
```dart
// lib/config/constants/environment.dart
static String apiUrl = 'http://localhost:3000/api';
static String socketUrl = 'http://localhost:3000';
```

#### Android Emulator
```dart
// lib/config/constants/environment.dart
static String apiUrl = 'http://10.0.2.2:3000/api';
static String socketUrl = 'http://10.0.2.2:3000';
```

**Nota:** `10.0.2.2` es la IP especial que Android usa para referirse al localhost de tu máquina.

#### Dispositivo Físico (iOS/Android)
```dart
// lib/config/constants/environment.dart
static String apiUrl = 'http://192.168.1.5:3000/api';  // Tu IP local
static String socketUrl = 'http://192.168.1.5:3000';
```

**Importante:** Tu dispositivo y tu computadora deben estar en la misma red WiFi.

### 3. Verificar que el Backend está Corriendo

```bash
cd BACK
npm run dev

# Deberías ver:
# 🚀 Agendly API running on port 3000
# MongoDB connected
```

### 4. Probar Conexión

```bash
# Desde tu terminal (reemplaza con tu IP)
curl http://192.168.1.5:3000/api/health

# Respuesta esperada:
# {
#   "success": true,
#   "message": "Agendly API is running",
#   "version": "2.0.0"
# }
```

## Endpoints Disponibles

### Auth

```dart
// Login
POST /api/auth/login
Body: {
  "email": "admin@clinica-elite.com",
  "password": "Password123!"
}

Response: {
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "...",
      "email": "admin@clinica-elite.com",
      "name": "Administrador",
      "role": "ADMIN",
      "businessId": "..."
    },
    "business": {
      "id": "...",
      "name": "Clínica Dental Élite",
      "slug": "clinica-elite",
      "primaryColor": "#0066CC",
      "secondaryColor": "#00AAFF"
    }
  }
}

// Register
POST /api/auth/register
Body: {
  "email": "nuevo@email.com",
  "password": "Password123!",
  "name": "Nombre Usuario",
  "businessName": "Mi Negocio"
}

// Check Auth Status
GET /api/auth/check-status
Headers: {
  "Authorization": "Bearer <token>"
}

// Update FCM Token
PATCH /api/auth/fcm-token
Headers: {
  "Authorization": "Bearer <token>"
}
Body: {
  "fcmToken": "fcm-token-here"
}
```

### Staff

```dart
// Get All Staff
GET /api/staff
Headers: {
  "Authorization": "Bearer <token>"
}

// Create Staff
POST /api/staff
Headers: {
  "Authorization": "Bearer <token>"
}
Body: {
  "userId": "user-id",
  "name": "Dr. Juan Pérez",
  "services": ["service-id-1", "service-id-2"],
  "workingHours": [
    {
      "day": 1,
      "startTime": "09:00",
      "endTime": "18:00",
      "isActive": true
    }
  ]
}

// Update Staff
PUT /api/staff/:id
Headers: {
  "Authorization": "Bearer <token>"
}
```

### Clients

```dart
// Get All Clients
GET /api/clients/business/:businessId
Headers: {
  "Authorization": "Bearer <token>"
}

// Create Client
POST /api/clients
Headers: {
  "Authorization": "Bearer <token>"
}
Body: {
  "businessId": "business-id",
  "name": "Cliente Nuevo",
  "email": "cliente@email.com",
  "phone": "+593999999999",
  "source": "manual"
}
```

### Appointments

```dart
// Get All Appointments
GET /api/appointments?startDate=2024-01-01&endDate=2024-12-31
Headers: {
  "Authorization": "Bearer <token>"
}

// Create Appointment
POST /api/appointments
Headers: {
  "Authorization": "Bearer <token>"
}
Body: {
  "customerId": "customer-id",
  "staffId": "staff-id",
  "serviceId": "service-id",
  "startTime": "2024-03-15T10:00:00Z",
  "notes": "Notas de la cita"
}

// Cancel Appointment
PATCH /api/appointments/:id/cancel
Headers: {
  "Authorization": "Bearer <token>"
}
```

### Marketing

```dart
// Get Welcome Kit
GET /api/marketing/welcome-kit/:businessId
Headers: {
  "Authorization": "Bearer <token>"
}

Response: {
  "success": true,
  "data": {
    "qrCodeUrl": "data:image/png;base64,...",
    "bookingUrl": "http://localhost:3000/booking/clinica-elite",
    "deepLinks": {
      "ios": "https://apps.apple.com/...",
      "android": "https://play.google.com/..."
    },
    "slug": "clinica-elite"
  }
}

// Download Flyer PDF
GET /api/marketing/flyer/:businessId
Headers: {
  "Authorization": "Bearer <token>"
}
```

## Socket.IO Events

### Conectar

```dart
SocketService().connect(businessId, token: token);
```

### Eventos que Puedes Escuchar

```dart
// Citas
SocketService().onAppointmentCreated((data) {
  print('Nueva cita: ${data['appointment']}');
});

SocketService().onAppointmentUpdated((data) {
  print('Cita actualizada: ${data['appointment']}');
});

SocketService().onAppointmentCancelled((data) {
  print('Cita cancelada: ${data['appointment']}');
});

// Staff
SocketService().onStaffCreated((data) {
  print('Nuevo staff: ${data['staff']}');
});

SocketService().onStaffUpdated((data) {
  print('Staff actualizado: ${data['staff']}');
});

// Clientes
SocketService().onClientCreated((data) {
  print('Nuevo cliente: ${data['client']}');
});
```

### Desconectar

```dart
SocketService().disconnect();
```

## Credenciales de Prueba

El backend viene con datos de seed. Usa estas credenciales:

```
Admin:
Email: admin@clinica-elite.com
Password: Password123!

Staff:
Email: dr.carlos.mendoza@clinica-elite.com
Password: Password123!
```

## Troubleshooting

### Error: "Failed to connect to /192.168.1.5:3000"

**Causa:** El dispositivo no puede alcanzar tu computadora.

**Solución:**
1. Verifica que estén en la misma red WiFi
2. Desactiva el firewall temporalmente
3. En macOS, ve a Preferencias > Compartir > Firewall y permite conexiones

### Error: "SocketException: Connection refused"

**Causa:** El backend no está corriendo o la IP es incorrecta.

**Solución:**
1. Verifica que el backend esté corriendo: `npm run dev`
2. Verifica la IP: `ifconfig` o `ipconfig`
3. Prueba con curl: `curl http://TU_IP:3000/api/health`

### Error: "DioException: Connection timeout"

**Causa:** El backend está muy lento o no responde.

**Solución:**
1. Verifica que MongoDB esté corriendo
2. Revisa los logs del backend
3. Aumenta el timeout en `dio_client.dart`:
```dart
connectTimeout: const Duration(seconds: 60),
```

### Error: "401 Unauthorized"

**Causa:** Token inválido o expirado.

**Solución:**
1. Haz logout y vuelve a hacer login
2. Verifica que el JWT_SEED sea el mismo en backend y app
3. Verifica que el token no haya expirado (default: 2h)

### Socket no conecta

**Causa:** URL incorrecta o backend sin Socket.IO.

**Solución:**
1. Verifica que el backend tenga Socket.IO configurado
2. Usa la misma URL base sin `/api`:
```dart
socketUrl: 'http://192.168.1.5:3000'  // Sin /api
```

## Testing de Endpoints

### Usar Postman/Insomnia

1. Importa esta colección base:

```json
{
  "info": {
    "name": "Agendly API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@clinica-elite.com\",\n  \"password\": \"Password123!\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "http://localhost:3000/api/auth/login",
              "protocol": "http",
              "host": ["localhost"],
              "port": "3000",
              "path": ["api", "auth", "login"]
            }
          }
        }
      ]
    }
  ]
}
```

2. Reemplaza `localhost` con tu IP si usas dispositivo físico

### Usar curl

```bash
# Login
curl -X POST http://192.168.1.5:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@clinica-elite.com","password":"Password123!"}'

# Get Staff (reemplaza TOKEN)
curl -X GET http://192.168.1.5:3000/api/staff \
  -H "Authorization: Bearer TOKEN"
```

## Configuración de Producción

Cuando despliegues a producción:

```dart
// lib/config/constants/environment.dart
static String apiUrl = const String.fromEnvironment(
  'API_URL',
  defaultValue: 'https://api.tudominio.com/api',  // Tu API en producción
);

static String socketUrl = const String.fromEnvironment(
  'SOCKET_URL',
  defaultValue: 'https://api.tudominio.com',
);
```

Luego compila con:

```bash
flutter build apk --dart-define=API_URL=https://api.tudominio.com/api
flutter build ios --dart-define=API_URL=https://api.tudominio.com/api
```

---

**¡Listo! Tu app Flutter está completamente integrada con el backend Node.js** 🚀
