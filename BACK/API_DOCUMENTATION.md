# Agendly Backend API - Documentación Completa

## 🏗️ Arquitectura

Este backend está construido con **Clean Architecture** siguiendo los principios SOLID:

```
src/
├── domain/              # Capa de dominio (entidades, DTOs, interfaces)
│   ├── entities/        # Entidades de negocio
│   ├── dtos/           # Data Transfer Objects con validación
│   ├── repositories/   # Interfaces de repositorios
│   ├── datasources/    # Interfaces de datasources
│   └── use-cases/      # Casos de uso de la aplicación
├── infrastructure/      # Capa de infraestructura
│   ├── datasources/    # Implementaciones de datasources (MongoDB)
│   ├── repositories/   # Implementaciones de repositorios
│   ├── mappers/        # Mappers entre modelos y entidades
│   └── services/       # Servicios de infraestructura
├── presentation/        # Capa de presentación
│   ├── controllers/    # Controladores HTTP
│   ├── routes/         # Definición de rutas
│   └── middlewares/    # Middlewares (auth, roles, etc.)
└── config/             # Configuración y adaptadores
```

## 🔐 Sistema RBAC (Roles)

- **SUPER_ADMIN**: Propietario del SaaS, acceso total
- **ADMIN**: Gerente/Suscriptor del negocio
- **STAFF**: Empleado del negocio
- **USER**: Cliente final

## 📊 Índices de Base de Datos

### Appointment
- `businessId` (index)
- `staffId` (index)
- `businessId + staffId` (compound)
- `businessId + startTime` (compound)
- `businessId + status` (compound)
- `businessId + customerId` (compound) - **Nuevo**
- `businessId + isFirstTime` (compound) - **Nuevo**
- `businessId + clientDevice` (compound) - **Nuevo**
- `staffId + startTime + endTime` (compound)

### Staff
- `businessId` (index)
- `businessId + userId` (compound)
- `businessId + isActive` (compound)
- `businessId + averageRating` (compound, descendente) - **Nuevo**

### Client
- `businessId` (index)
- `businessId + source` (compound) - **Nuevo**
- `businessId + createdAt` (compound) - **Nuevo**

### Service
- `businessId` (index)
- `businessId + category` (compound) - **Nuevo**
- `businessId + isActive` (compound)
- `businessId + email` (unique compound)
- `businessId + userId` (compound)

### Review
- `businessId` (index)
- `staffId` (index)
- `appointmentId` (unique)
- `businessId + staffId` (compound)
- `businessId + rating` (compound)

## 🚀 Endpoints Principales

### 1. Autenticación
```
POST /api/auth/register
POST /api/auth/login
PUT  /api/auth/fcm-token
```

### 1.1 Web Booking (Público - Sin Autenticación)
```
GET  /booking/:slug                    # Información del negocio
GET  /booking/:slug/availability       # Disponibilidad de horarios
POST /booking/:slug/book               # Reserva rápida (Rate Limited: 5/15min)
```

### 2. Negocios (Business)
```
POST   /api/businesses
GET    /api/businesses/:id
PUT    /api/businesses/:id
DELETE /api/businesses/:id
```

### 3. Staff
```
POST   /api/staff
GET    /api/staff/business/:businessId
GET    /api/staff/:id
PUT    /api/staff/:id
DELETE /api/staff/:id
```

### 4. Servicios
```
POST   /api/services
GET    /api/services/business/:businessId
GET    /api/services/:id
PUT    /api/services/:id
DELETE /api/services/:id
```

### 5. Citas (Appointments)
```
POST   /api/appointments
GET    /api/appointments/business/:businessId
GET    /api/appointments/:id
PUT    /api/appointments/:id
DELETE /api/appointments/:id
```

### 6. Clientes
```
POST   /api/clients
GET    /api/clients/business/:businessId
GET    /api/clients/business/:businessId/:clientId
```

### 7. Reseñas (Reviews)
```
POST   /api/reviews
GET    /api/reviews/business/:businessId
GET    /api/reviews/business/:businessId/staff/:staffId
GET    /api/reviews/business/:businessId/staff/:staffId/average
```

### 8. Disponibilidad (Smart Calendar)
```
GET /api/availability/slots?businessId=X&staffId=Y&serviceId=Z&date=2026-03-15
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

### 9. Reportes (Business Intelligence)

#### 9.1 Reporte de Ingresos
```
GET /api/reports/revenue/:businessId?startDate=2026-01-01&endDate=2026-03-31
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 15000,
    "period": "2026-01-01 - 2026-03-31",
    "breakdown": [
      {
        "date": "2026-01-15",
        "revenue": 500,
        "appointmentsCount": 10
      }
    ]
  }
}
```

#### 9.2 Ranking de Staff
```
GET /api/reports/staff-ranking/:businessId
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "staffId": "123",
      "staffName": "Dr. Juan Pérez",
      "averageRating": 4.8,
      "totalReviews": 45,
      "totalSales": 12000,
      "totalAppointments": 120
    }
  ]
}
```

#### 9.3 Servicios Más Vendidos
```
GET /api/reports/top-services/:businessId?limit=10
```

#### 9.4 Tasa de Retención
```
GET /api/reports/retention/:businessId
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "totalClients": 200,
    "returningClients": 150,
    "retentionRate": 75.0,
    "newClients": 50
  }
}
```

#### 9.5 Métricas de Super Admin
```
GET /api/reports/super-admin/metrics
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "totalBusinesses": 150,
    "activeBusinesses": 142,
    "totalRevenue": 28350,
    "subscriptionBreakdown": [
      { "plan": "FREE", "count": 50, "revenue": 0 },
      { "plan": "BASIC", "count": 60, "revenue": 1740 },
      { "plan": "PRO", "count": 30, "revenue": 2370 },
      { "plan": "ENTERPRISE", "count": 10, "revenue": 1990 }
    ],
    "storageUsage": {
      "totalUsed": 52428800,
      "averagePerBusiness": 369200
    },
    "growthMetrics": {
      "newBusinessesThisMonth": 12,
      "growthRate": 8.5
    }
  }
}
```

### 10. Marketing Físico (QR & Deep Linking)

#### 10.1 Crear Kit de Bienvenida
```
POST /api/marketing/welcome-kit/:businessId
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "qrCodeUrl": "data:image/png;base64,...",
    "deepLink": "https://agendly.com/join/clinica-dental",
    "slug": "clinica-dental"
  }
}
```

#### 10.2 Deep Link (Redirección Inteligente)
```
GET /api/marketing/join/:slug
```

**Comportamiento:**
- Detecta el OS del móvil (iOS/Android)
- Redirige a App Store o Play Store
- Inyecta `businessId` para vinculación automática

#### 10.3 Generar Flyer PDF
```
GET /api/marketing/flyer/:businessId
```

Descarga un PDF listo para imprimir con:
- Logo del negocio
- Código QR
- Información de contacto

## 🔔 WebSockets (Tiempo Real)

### Conexión Multi-plataforma
```javascript
socket.emit('join:business', {
  businessId: '123',
  userId: 'user456',
  role: 'ADMIN',
  platform: 'web' // 'web' | 'mobile_ios' | 'mobile_android'
});

socket.on('connection:success', (data) => {
  console.log('Conectado:', data);
});
```

### Eventos para Todos (business:*)
```javascript
socket.on('appointment:created', (data) => {
  console.log('Nueva cita:', data.appointment);
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

### Eventos Solo para Admins (admin:*)
```javascript
socket.on('appointment:new', (data) => {
  // Notificación especial para admins
  console.log('Nueva reserva:', data.appointment);
  console.log('Requiere acción:', data.requiresAction);
});

socket.on('review:low-rating', (data) => {
  // Alerta de calificación baja (≤2 estrellas)
  console.log('⚠️ Calificación baja:', data.review);
  console.log('Prioridad:', data.priority); // 'high'
});
```

## 📱 Notificaciones Push (FCM)

### Configurar Token FCM
```
PUT /api/auth/fcm-token
{
  "fcmToken": "firebase-token-here"
}
```

### Notificaciones Automáticas
- Recordatorio de cita (24h antes)
- Confirmación de cita
- Cancelación de cita

## 🔧 Variables de Entorno

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/agendly
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key
```

## 🚀 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Producción
npm run build
npm start

# Seed de base de datos
npm run db:seed
```

## 📦 Dependencias Principales

- **express**: Framework web
- **mongoose**: ODM para MongoDB
- **socket.io**: WebSockets en tiempo real
- **jsonwebtoken**: Autenticación JWT
- **bcryptjs**: Hash de contraseñas
- **firebase-admin**: Notificaciones push
- **multer**: Carga de archivos
- **qrcode**: Generación de códigos QR
- **pdfkit**: Generación de PDFs

## 🎯 Características Destacadas

### ✅ Smart Calendar
Algoritmo inteligente que calcula disponibilidad:
- Cruza horario laboral del staff
- Excluye citas ya agendadas
- Considera duración del servicio
- Genera slots cada 30 minutos

### ✅ Multi-Tenant Seguro
Todas las consultas filtran por `businessId` para aislamiento total

### ✅ Business Intelligence Avanzado
Motor completo de analytics con agregaciones MongoDB:
- **Rentabilidad**: Utilidad neta, margen de ganancia, servicios más rentables
- **Eficiencia**: Puntualidad del staff, retrasos promedio
- **Retención**: Clientes nuevos vs recurrentes, tasa de No-Show, ROI por canal
- **Mapa de Calor**: Ocupación por día/hora, horas pico y tranquilas
- **Feedback Loop**: Actualización automática de rating del staff

### ✅ Marketing Físico
Sistema completo de onboarding:
- Slugs únicos por negocio
- QR dinámicos
- Deep linking automático
- PDFs para impresión

## 📝 Notas de Producción

1. **Índices**: Ya están configurados en los modelos
2. **Seguridad**: Todas las rutas protegidas con JWT y RBAC
3. **Validación**: DTOs con validación estática
4. **Escalabilidad**: Preparado para crecimiento horizontal
5. **Observabilidad**: Logs estructurados listos para integración

---

## 📊 Endpoints de Analytics (Nuevo)

### Rentabilidad
```http
GET /api/analytics/profitability/:businessId?startDate=2026-01-01&endDate=2026-03-31
Authorization: Bearer {token}
```

### Eficiencia
```http
GET /api/analytics/efficiency/:businessId?startDate=2026-01-01&endDate=2026-03-31
Authorization: Bearer {token}
```

### Retención
```http
GET /api/analytics/retention/:businessId
Authorization: Bearer {token}
```

### Mapa de Calor
```http
GET /api/analytics/heatmap/:businessId?startDate=2026-01-01&endDate=2026-03-31
Authorization: Bearer {token}
```

### Dashboard Completo
```http
GET /api/analytics/dashboard/:businessId?startDate=2026-01-01&endDate=2026-03-31
Authorization: Bearer {token}
```

**Ver documentación completa en:** `BUSINESS_INTELLIGENCE.md`

---

## 🔄 Sistema de Feedback Loop

Cuando se crea una reseña:
1. Se actualiza automáticamente el `averageRating` del Staff
2. Se incrementa `totalReviews`
3. Se emite evento por WebSocket: `review:created`
4. Si rating ≤ 2, se emite alerta: `review:low-rating` (solo admins)

---

**Desarrollado con Clean Architecture y TypeScript** 🚀
