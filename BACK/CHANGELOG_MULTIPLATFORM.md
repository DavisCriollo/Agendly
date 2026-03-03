# 📋 Changelog - Soporte Multi-plataforma v1.1.0

## 🎯 Resumen de Cambios

Se ha realizado el **pulido final** del backend de Agendly para soportar múltiples plataformas (Web, iOS, Android) y Web Booking público.

---

## ✨ Nuevas Funcionalidades

### 1. 🌐 CORS Multi-origen Configurado

**Archivos modificados:**
- `src/presentation/server.ts`
- `src/config/envs.ts`
- `.env.example`

**Cambios:**
- CORS configurado para aceptar peticiones desde múltiples orígenes
- Soporte para apps móviles (Capacitor/Ionic)
- Orígenes configurables via variable de entorno `CORS_ORIGINS`
- Headers personalizados permitidos: `X-Client-Source`

**Ejemplo de configuración:**
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:4200,https://tudominio.com
```

---

### 2. 📱 Client-Source Middleware

**Archivos creados:**
- `src/presentation/middlewares/client-source.middleware.ts`

**Funcionalidad:**
- Detecta automáticamente la plataforma del cliente
- Métodos de detección:
  1. Header `X-Client-Source` (preferido)
  2. User-Agent (fallback)
- Valores posibles: `web`, `mobile_ios`, `mobile_android`, `unknown`
- Logs automáticos de cada request con su origen

**Uso:**
```typescript
// El middleware agrega req.clientSource a cada request
app.use(ClientSourceMiddleware.detect);
```

---

### 3. 🌍 Web Booking (Deep Linking)

**Archivos creados:**
- `src/domain/dtos/booking/quick-booking.dto.ts`
- `src/domain/use-cases/booking/quick-booking.use-case.ts`
- `src/presentation/booking/booking.controller.ts`
- `src/presentation/booking/booking.routes.ts`

**Endpoints públicos:**

#### GET `/booking/:slug`
Obtiene información completa del negocio para mostrar en landing page.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "business": { "id", "name", "logoUrl", "colors", "slug" },
    "services": [...],
    "staff": [...]
  }
}
```

#### GET `/booking/:slug/availability`
Obtiene horarios disponibles (reutiliza Smart Calendar).

**Query params:**
- `staffId`: ID del staff
- `serviceId`: ID del servicio
- `date`: Fecha (YYYY-MM-DD)

#### POST `/booking/:slug/book`
Crea reserva rápida sin autenticación.

**Body:**
```json
{
  "staffId": "st1",
  "serviceId": "s1",
  "startTime": "2026-03-15T09:00:00Z",
  "endTime": "2026-03-15T10:00:00Z",
  "clientName": "María González",
  "clientPhone": "+34612345678",
  "clientEmail": "maria@example.com",
  "notes": "Primera visita"
}
```

**Rate Limiting:** 5 intentos por IP cada 15 minutos

---

### 4. 👤 Registro Ligero de Clientes Invitados

**Archivos modificados:**
- `src/domain/use-cases/booking/quick-booking.use-case.ts`

**Funcionalidad:**
- Permite crear citas **sin contraseña**
- Solo requiere: nombre + teléfono
- Email opcional
- Flujo automático:
  1. Verifica si el cliente existe
  2. Si no existe, crea usuario con email temporal: `{phone}@guest.agendly.com`
  3. Genera contraseña temporal (UUID)
  4. Crea perfil de cliente
  5. Crea la cita

**Ventajas:**
- Fricción mínima para el cliente
- Conversión más alta
- Cliente puede activar cuenta después

---

### 5. 🔄 Sincronización Multi-plataforma Mejorada

**Archivos modificados:**
- `src/infrastructure/services/socket.service.ts`

**Mejoras:**

#### Rooms Específicos
- `business:{businessId}` - Todos los usuarios del negocio
- `admin:{businessId}` - Solo admins
- `user:{userId}` - Usuario específico

#### Eventos Mejorados
```javascript
// Para todos
socket.on('appointment:created', (data) => {});
socket.on('appointment:updated', (data) => {});
socket.on('appointment:cancelled', (data) => {});
socket.on('review:created', (data) => {});

// Solo para admins
socket.on('appointment:new', (data) => {
  // data.requiresAction = true
});

socket.on('review:low-rating', (data) => {
  // data.priority = 'high'
});
```

#### Metadata de Conexión
```javascript
socket.emit('join:business', {
  businessId: '123',
  userId: 'user456',
  role: 'ADMIN',
  platform: 'web' // Nuevo campo
});
```

#### Métodos Nuevos
- `emitToAdmins()` - Solo para admins
- `emitToUser()` - Usuario específico
- `getConnectedClients()` - Contador de clientes
- `broadcastSystemMessage()` - Mensaje global

---

### 6. ⚠️ Global Error Handler Estandarizado

**Archivos modificados:**
- `src/presentation/middlewares/error.middleware.ts`

**Formato unificado:**
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

**Códigos estandarizados:**
- `BAD_REQUEST` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `CONFLICT` (409)
- `RATE_LIMIT_EXCEEDED` (429)
- `INTERNAL_SERVER_ERROR` (500)

**Ventajas:**
- Mismo formato para Web, iOS y Android
- Fácil de parsear
- Incluye timestamp y path
- Logs mejorados

---

### 7. 🛡️ Rate Limiting Implementado

**Archivos creados:**
- `src/presentation/middlewares/rate-limit.middleware.ts`

**Límites configurados:**

| Endpoint | Límite | Ventana |
|----------|--------|---------|
| `/booking/:slug/book` | 5 req | 15 min |
| `/api/auth/login` | 10 req | 15 min |
| `/api/*` (general) | 100 req | 15 min |

**Headers de respuesta:**
```http
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1709294400
```

**Protección contra:**
- Bots
- Spam
- Ataques de fuerza bruta
- Abuso de API

---

### 8. 📊 Campo `clientSource` en Appointments

**Archivos modificados:**
- `src/domain/entities/appointment.entity.ts`
- `src/infrastructure/datasources/mongo/models/appointment.model.ts`
- `src/presentation/appointments/appointments.controller.ts`

**Cambios:**
- Nuevo campo `clientSource` en modelo de citas
- Se guarda automáticamente al crear cita
- Permite analítica por plataforma
- Valores: `web`, `mobile_ios`, `mobile_android`, `unknown`

**Ejemplo:**
```json
{
  "id": "apt123",
  "businessId": "abc",
  "clientSource": "mobile_ios",
  "status": "PENDING",
  ...
}
```

---

## 📦 Dependencias Agregadas

```json
{
  "express-rate-limit": "^7.1.5"
}
```

---

## 🔧 Variables de Entorno Nuevas

```env
# CORS Origins (separados por comas)
CORS_ORIGINS=http://localhost:3000,http://localhost:4200,https://tudominio.com

# Base URL (ya existía)
BASE_URL=https://agendly.com
```

---

## 📝 Archivos de Documentación Creados

1. **MULTIPLATFORM_GUIDE.md** - Guía completa de soporte multi-plataforma
2. **CHANGELOG_MULTIPLATFORM.md** - Este archivo

---

## 🚀 Mejoras de Rendimiento

- ✅ Logs optimizados con información de plataforma
- ✅ Rate limiting para prevenir abuso
- ✅ CORS configurado correctamente
- ✅ WebSockets con rooms específicos
- ✅ Detección automática de plataforma

---

## 🔒 Mejoras de Seguridad

- ✅ Rate limiting en endpoints críticos
- ✅ CORS restrictivo pero flexible
- ✅ Validación de datos en Quick Booking
- ✅ Logs de seguridad mejorados
- ✅ Error handling estandarizado

---

## 📊 Métricas y Monitoreo

### Logs Automáticos
```
[Client Source] POST /api/appointments - Source: mobile_ios - UA: Dart/2.19...
[Socket] Client connected: abc123
[Socket] abc123 joined business:123 as ADMIN from web
[Socket] Emitted appointment:created to business:123
[2026-03-01T10:30:00.000Z] 404 - NotFoundError: Negocio no encontrado - /booking/invalid
```

### Métricas Disponibles
- Clientes conectados por negocio
- Requests por plataforma
- Rate limit hits
- Errores por código

---

## ✅ Checklist de Compatibilidad

### Backend
- [x] CORS configurado
- [x] Client-Source Middleware
- [x] Web Booking endpoints
- [x] Registro ligero
- [x] WebSockets mejorados
- [x] Error handling estandarizado
- [x] Rate limiting
- [x] Campo clientSource

### Frontend Web
- [ ] Configurar `X-Client-Source: 'web'`
- [ ] Manejo de errores estandarizados
- [ ] WebSocket con platform detection
- [ ] Landing page de reserva

### App Móvil
- [ ] Configurar `X-Client-Source` dinámico
- [ ] Manejo de errores estandarizados
- [ ] WebSocket con platform detection
- [ ] Deep linking desde QR

---

## 🔄 Migración

### Sin Breaking Changes

Todos los cambios son **retrocompatibles**:
- Endpoints existentes funcionan igual
- Nuevos campos son opcionales
- CORS más permisivo (no restrictivo)
- WebSockets mantienen compatibilidad

### Pasos Recomendados

1. **Actualizar variables de entorno**
   ```bash
   cp .env.example .env
   # Agregar CORS_ORIGINS
   ```

2. **Recompilar**
   ```bash
   npm run build
   ```

3. **Reiniciar servidor**
   ```bash
   npm start
   ```

4. **Verificar health check**
   ```bash
   curl http://localhost:3000/api/health
   ```

---

## 📚 Recursos Adicionales

- **API_DOCUMENTATION.md** - Documentación completa de API
- **MULTIPLATFORM_GUIDE.md** - Guía de integración multi-plataforma
- **DEPLOYMENT.md** - Guía de despliegue

---

## 🎯 Próximos Pasos Sugeridos

### Backend
- [ ] Implementar webhooks para integraciones
- [ ] Agregar analytics de uso por plataforma
- [ ] Implementar caché con Redis
- [ ] Tests de integración multi-plataforma

### Frontend
- [ ] Landing page de reserva rápida
- [ ] Panel de admin con WebSockets
- [ ] PWA para instalación web

### Móvil
- [ ] Deep linking completo
- [ ] Notificaciones push
- [ ] Sincronización offline

---

**Versión:** 1.1.0  
**Fecha:** 2026-03-01  
**Autor:** Arquitecto de Software Senior  
**Estado:** ✅ Producción Ready

---

**El backend está completamente listo para soportar Web, iOS y Android simultáneamente.** 🚀
