# 📱 Guía de Soporte Multi-plataforma - Agendly

## 🎯 Resumen de Mejoras

El backend de Agendly ha sido mejorado para soportar múltiples plataformas (Web, iOS, Android) con las siguientes características:

- ✅ **CORS configurado** para múltiples orígenes
- ✅ **Client-Source Middleware** que identifica la plataforma
- ✅ **Web Booking** con Deep Linking
- ✅ **Registro ligero** para clientes invitados
- ✅ **Sincronización en tiempo real** multi-plataforma
- ✅ **Global Error Handler** estandarizado
- ✅ **Rate Limiting** para protección

---

## 🔧 1. Configuración CORS

### Orígenes Permitidos

El servidor acepta peticiones desde:

```typescript
// Configurables via .env
CORS_ORIGINS=http://localhost:3000,http://localhost:4200,http://localhost:5173,https://tudominio.com

// Automáticos (para apps móviles)
- capacitor://localhost
- ionic://localhost
- http://localhost:8100
```

### Headers Permitidos

```typescript
- Content-Type
- Authorization
- X-Client-Source  // Nuevo: identifica la plataforma
```

### Configuración en Cliente

#### Web (React/Vue/Angular)
```javascript
fetch('https://api.agendly.com/api/endpoint', {
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Source': 'web'
  }
});
```

#### Flutter (iOS/Android)
```dart
final response = await http.post(
  Uri.parse('https://api.agendly.com/api/endpoint'),
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Source': Platform.isIOS ? 'mobile_ios' : 'mobile_android',
  },
);
```

---

## 📱 2. Client-Source Middleware

### Detección Automática

El middleware detecta automáticamente la plataforma usando:

1. **Header `X-Client-Source`** (preferido)
2. **User-Agent** (fallback)

### Valores Posibles

```typescript
type ClientSource = 'web' | 'mobile_ios' | 'mobile_android' | 'unknown';
```

### Logs Automáticos

Cada request registra:
```
[Client Source] POST /api/appointments - Source: mobile_ios - UA: Dart/2.19...
```

### Uso en Base de Datos

El campo `clientSource` se guarda en cada cita:

```json
{
  "id": "123",
  "businessId": "abc",
  "clientSource": "mobile_ios",
  ...
}
```

---

## 🌐 3. Web Booking (Deep Linking)

### Endpoints Públicos

#### 3.1 Obtener Información del Negocio

```http
GET /booking/:slug
```

**Ejemplo:**
```bash
curl https://api.agendly.com/booking/clinica-dental
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "business": {
      "id": "123",
      "name": "Clínica Dental Sonrisas",
      "logoUrl": "https://...",
      "primaryColor": "#4A90E2",
      "secondaryColor": "#F5A623",
      "slug": "clinica-dental"
    },
    "services": [
      {
        "id": "s1",
        "name": "Limpieza Dental",
        "description": "Limpieza profunda",
        "duration": 60,
        "price": 50
      }
    ],
    "staff": [
      {
        "id": "st1",
        "name": "Dr. Juan Pérez",
        "avatarUrl": "https://...",
        "services": ["s1", "s2"]
      }
    ]
  }
}
```

#### 3.2 Obtener Disponibilidad

```http
GET /booking/:slug/availability?staffId=st1&serviceId=s1&date=2026-03-15
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "startTime": "2026-03-15T09:00:00.000Z",
      "endTime": "2026-03-15T10:00:00.000Z"
    },
    {
      "startTime": "2026-03-15T10:30:00.000Z",
      "endTime": "2026-03-15T11:30:00.000Z"
    }
  ]
}
```

#### 3.3 Crear Reserva Rápida

```http
POST /booking/:slug/book
```

**Body:**
```json
{
  "staffId": "st1",
  "serviceId": "s1",
  "startTime": "2026-03-15T09:00:00.000Z",
  "endTime": "2026-03-15T10:00:00.000Z",
  "clientName": "María González",
  "clientPhone": "+34612345678",
  "clientEmail": "maria@example.com",
  "notes": "Primera visita"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "apt123",
    "businessId": "123",
    "status": "PENDING",
    "clientSource": "web",
    ...
  },
  "message": "Cita creada exitosamente. Recibirás una confirmación pronto."
}
```

### Rate Limiting

- **Máximo:** 5 reservas por IP cada 15 minutos
- **Protección:** Contra bots y spam

---

## 👤 4. Registro Ligero de Clientes

### Flujo Automático

1. Cliente completa formulario con **solo nombre y teléfono**
2. Sistema verifica si el cliente existe
3. Si no existe:
   - Crea usuario con email temporal: `{phone}@guest.agendly.com`
   - Crea perfil de cliente
   - Genera contraseña temporal (UUID)
4. Crea la cita automáticamente

### Sin Contraseña Inmediata

El cliente puede reservar **sin crear cuenta**. Posteriormente puede:
- Recibir link para activar cuenta
- Establecer contraseña desde la app móvil
- Acceder con su teléfono

### Ejemplo de Cliente Invitado

```json
{
  "id": "client123",
  "businessId": "abc",
  "userId": "user456",
  "name": "María González",
  "email": "612345678@guest.agendly.com",
  "phone": "+34612345678",
  "notes": "Cliente creado desde reserva rápida"
}
```

---

## 🔄 5. Sincronización Multi-plataforma

### WebSockets Mejorados

#### Conexión desde Cliente

**Web:**
```javascript
import io from 'socket.io-client';

const socket = io('https://api.agendly.com', {
  transports: ['websocket', 'polling'],
});

socket.emit('join:business', {
  businessId: '123',
  userId: 'user456',
  role: 'ADMIN',
  platform: 'web'
});

socket.on('connection:success', (data) => {
  console.log('Conectado:', data);
});
```

**Flutter:**
```dart
import 'package:socket_io_client/socket_io_client.dart' as IO;

final socket = IO.io('https://api.agendly.com', <String, dynamic>{
  'transports': ['websocket'],
});

socket.emit('join:business', {
  'businessId': '123',
  'userId': 'user456',
  'role': 'ADMIN',
  'platform': Platform.isIOS ? 'mobile_ios' : 'mobile_android',
});

socket.on('connection:success', (data) {
  print('Conectado: $data');
});
```

### Eventos en Tiempo Real

#### Para Todos (business:*)
```javascript
socket.on('appointment:created', (data) => {
  console.log('Nueva cita:', data.appointment);
  // Actualizar UI
});

socket.on('appointment:updated', (data) => {
  console.log('Cita actualizada:', data.appointment);
});

socket.on('appointment:cancelled', (data) => {
  console.log('Cita cancelada:', data.appointment);
});

socket.on('review:created', (data) => {
  console.log('Nueva reseña:', data.review);
});
```

#### Solo para Admins (admin:*)
```javascript
socket.on('appointment:new', (data) => {
  // Notificación especial para admins
  showNotification({
    title: 'Nueva Reserva',
    message: data.message,
    priority: 'high',
    requiresAction: data.requiresAction
  });
});

socket.on('review:low-rating', (data) => {
  // Alerta de calificación baja
  showAlert({
    title: '⚠️ Calificación Baja',
    message: data.message,
    review: data.review,
    priority: data.priority
  });
});
```

#### Para Usuario Específico (user:*)
```javascript
socket.on('appointment:confirmed', (data) => {
  console.log('Tu cita fue confirmada:', data);
});
```

### Rooms Disponibles

- `business:{businessId}` - Todos los usuarios del negocio
- `admin:{businessId}` - Solo admins del negocio
- `user:{userId}` - Usuario específico

---

## ⚠️ 6. Global Error Handler

### Formato Estandarizado

Todos los errores siguen este formato:

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Negocio no encontrado",
    "status": 404,
    "timestamp": "2026-03-01T10:30:00.000Z",
    "path": "/booking/invalid-slug"
  }
}
```

### Códigos de Error

| Código | Status | Descripción |
|--------|--------|-------------|
| `BAD_REQUEST` | 400 | Datos inválidos |
| `UNAUTHORIZED` | 401 | No autenticado |
| `FORBIDDEN` | 403 | Sin permisos |
| `NOT_FOUND` | 404 | Recurso no encontrado |
| `CONFLICT` | 409 | Conflicto (ej: email duplicado) |
| `RATE_LIMIT_EXCEEDED` | 429 | Demasiadas peticiones |
| `INTERNAL_SERVER_ERROR` | 500 | Error del servidor |

### Manejo en Cliente

**JavaScript:**
```javascript
try {
  const response = await fetch('/api/endpoint');
  const data = await response.json();
  
  if (!data.success) {
    // Error estandarizado
    console.error(`Error ${data.error.code}: ${data.error.message}`);
    showError(data.error.message);
  }
} catch (error) {
  console.error('Network error:', error);
}
```

**Flutter:**
```dart
try {
  final response = await http.get(Uri.parse('/api/endpoint'));
  final data = jsonDecode(response.body);
  
  if (data['success'] == false) {
    final error = data['error'];
    print('Error ${error['code']}: ${error['message']}');
    showSnackBar(error['message']);
  }
} catch (e) {
  print('Network error: $e');
}
```

---

## 🛡️ 7. Rate Limiting

### Límites Configurados

| Endpoint | Límite | Ventana |
|----------|--------|---------|
| `/booking/:slug/book` | 5 req | 15 min |
| `/api/auth/login` | 10 req | 15 min |
| `/api/*` (general) | 100 req | 15 min |

### Headers de Respuesta

```http
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1709294400
```

### Respuesta al Exceder Límite

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Demasiados intentos. Por favor, intenta nuevamente en 15 minutos.",
    "status": 429,
    "timestamp": "2026-03-01T10:30:00.000Z",
    "path": "/booking/clinica-dental/book"
  }
}
```

---

## 🔍 8. Monitoreo y Logs

### Logs Automáticos

Cada request registra:
```
[Client Source] POST /api/appointments - Source: mobile_ios - UA: Dart/2.19...
[Socket] Client connected: abc123
[Socket] abc123 joined business:123 as ADMIN from web
[Socket] Emitted appointment:created to business:123
```

### Métricas Disponibles

```typescript
// Obtener clientes conectados
const count = SocketService.getConnectedClients(businessId);
console.log(`${count} clientes conectados`);
```

---

## 🚀 9. Ejemplo de Integración Completa

### Landing Page de Reserva (React)

```jsx
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

function BookingPage({ slug }) {
  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  
  useEffect(() => {
    // Cargar información del negocio
    fetch(`https://api.agendly.com/booking/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBusiness(data.data.business);
          setServices(data.data.services);
        }
      });
    
    // Conectar WebSocket
    const socket = io('https://api.agendly.com');
    socket.emit('join:business', {
      businessId: business?.id,
      platform: 'web'
    });
    
    socket.on('appointment:created', (data) => {
      // Actualizar disponibilidad en tiempo real
      loadAvailability();
    });
    
    return () => socket.disconnect();
  }, [slug]);
  
  const handleBooking = async (formData) => {
    const response = await fetch(`https://api.agendly.com/booking/${slug}/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Source': 'web'
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert(data.message);
    } else {
      alert(data.error.message);
    }
  };
  
  return (
    <div style={{ 
      backgroundColor: business?.primaryColor,
      color: business?.secondaryColor 
    }}>
      <h1>{business?.name}</h1>
      {/* Formulario de reserva */}
    </div>
  );
}
```

---

## ✅ Checklist de Implementación

### Backend
- [x] CORS configurado para múltiples orígenes
- [x] Client-Source Middleware implementado
- [x] Web Booking endpoints creados
- [x] Registro ligero de clientes
- [x] WebSockets mejorados con rooms
- [x] Global Error Handler estandarizado
- [x] Rate Limiting activo
- [x] Campo `clientSource` en appointments

### Frontend Web
- [ ] Configurar `X-Client-Source: 'web'`
- [ ] Implementar manejo de errores estandarizados
- [ ] Conectar WebSocket para tiempo real
- [ ] Landing page de reserva rápida

### App Móvil (Flutter)
- [ ] Configurar `X-Client-Source` dinámico (iOS/Android)
- [ ] Implementar manejo de errores estandarizados
- [ ] Conectar WebSocket con platform detection
- [ ] Deep linking desde QR

---

**El backend está listo para soportar Web, iOS y Android simultáneamente.** 🚀
