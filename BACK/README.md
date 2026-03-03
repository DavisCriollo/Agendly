# Agendly Backend - SaaS Multi-Tenant

Backend API completo para **Agendly**, un sistema de citas multi-tenant con Clean Architecture.

## 🚀 Características

- ✅ **Clean Architecture** con TypeScript
- ✅ **Multi-Tenant** con aislamiento por `businessId`
- ✅ **RBAC**: SUPER_ADMIN, ADMIN, STAFF, USER
- ✅ **Smart Calendar**: Disponibilidad inteligente
- ✅ **Business Intelligence Avanzado**: 
  - 💰 Rentabilidad (utilidad neta, margen de ganancia)
  - ⚡ Eficiencia (puntualidad del staff)
  - 🔄 Retención (clientes nuevos vs recurrentes, No-Show)
  - 🔥 Mapa de Calor (ocupación por día/hora)
- ✅ **Feedback Loop**: Actualización automática de rating del staff
- ✅ **Marketing Físico**: QR, Deep Linking, PDFs
- ✅ **Multi-Plataforma**: Web, iOS, Android
- ✅ **WebSockets**: Actualizaciones en tiempo real
- ✅ **FCM**: Notificaciones push
- ✅ **Índices Optimizados**: Para consultas rápidas

## 📋 Requisitos

- Node.js 18+
- MongoDB (local o Atlas)
- Firebase (opcional, para push notifications)

## 🔧 Instalación

```bash
npm install
```

Copia `.env.example` a `.env` y configura:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/agendly
JWT_SEED=your-secret-key
JWT_EXPIRES_IN=7d

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-email
FIREBASE_PRIVATE_KEY=your-key
```

## 🏃 Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

### Seed de Datos
```bash
npm run db:seed
```

**Credenciales de prueba:**
- Super Admin: `superadmin@agendly.com` / `admin123`
- Admin: `admin@test.com` / `123456789`
- Staff: `test@test.com` / `123456789`

## 📚 Documentación

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Documentación completa de endpoints
- **[BUSINESS_INTELLIGENCE.md](./BUSINESS_INTELLIGENCE.md)** - Guía completa de Analytics y BI
- **[MULTIPLATFORM_GUIDE.md](./MULTIPLATFORM_GUIDE.md)** - Soporte multi-plataforma
- **[CHANGELOG_BI.md](./CHANGELOG_BI.md)** - Cambios en Business Intelligence v2.0

## 🏗️ Arquitectura

```
src/
├── domain/              # Entidades, DTOs, Interfaces
├── infrastructure/      # Datasources, Repositorios, Servicios
├── presentation/        # Controladores, Rutas, Middlewares
└── config/             # Configuración y Adaptadores
```

## 🔑 Endpoints Principales

- **Auth**: `/api/auth/*`
- **Business**: `/api/businesses/*`
- **Staff**: `/api/staff/*`
- **Services**: `/api/services/*`
- **Appointments**: `/api/appointments/*`
- **Clients**: `/api/clients/*`
- **Reviews**: `/api/reviews/*`
- **Reports**: `/api/reports/*` (legacy)
- **Analytics**: `/api/analytics/*` ⭐ **Nuevo**
- **Availability**: `/api/availability/slots`
- **Marketing**: `/api/marketing/*`
- **Booking**: `/booking/:slug` (público)

## 🎯 Funcionalidades Destacadas

### Smart Calendar
```
GET /api/availability/slots?businessId=X&staffId=Y&serviceId=Z&date=2026-03-15
```

### Business Intelligence ⭐ Nuevo
```
GET /api/analytics/profitability/:businessId?startDate=...&endDate=...
GET /api/analytics/efficiency/:businessId?startDate=...&endDate=...
GET /api/analytics/retention/:businessId
GET /api/analytics/heatmap/:businessId?startDate=...&endDate=...
GET /api/analytics/dashboard/:businessId?startDate=...&endDate=...
```

**Dashboards disponibles:**
- 💰 **Rentabilidad**: Utilidad neta, margen de ganancia, servicios más rentables
- ⚡ **Eficiencia**: Puntualidad del staff, retrasos promedio
- 🔄 **Retención**: Clientes nuevos vs recurrentes, tasa de No-Show, ROI por canal
- 🔥 **Mapa de Calor**: Ocupación por día/hora, horas pico y tranquilas

### Marketing Físico
```
POST /api/marketing/welcome-kit/:businessId
GET  /api/marketing/join/:slug (Deep Link)
GET  /api/marketing/flyer/:businessId (PDF)
```

## 🔔 WebSockets

```javascript
socket.emit('join:business', businessId);
socket.on('appointment:created', (data) => {});
socket.on('review:low-rating', (alert) => {});
```

## 📦 Dependencias

- express, mongoose, socket.io
- jsonwebtoken, bcryptjs
- firebase-admin, multer
- qrcode, pdfkit

## 📝 Licencia

MIT

---

**Desarrollado con Clean Architecture** 🚀
