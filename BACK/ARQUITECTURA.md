# Arquitectura del Backend - Agendly

## 📐 Clean Architecture Implementada

Este proyecto sigue los principios de **Clean Architecture** con una separación clara de responsabilidades:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  (Controllers, Routes, Middlewares)                         │
│  - Maneja HTTP requests/responses                           │
│  - Validación de entrada                                    │
│  - Autenticación y autorización                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    DOMAIN LAYER                              │
│  (Entities, DTOs, Use Cases, Interfaces)                    │
│  - Lógica de negocio pura                                   │
│  - Independiente de frameworks                              │
│  - Define contratos (interfaces)                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                         │
│  (Datasources, Repositories, Services, Mappers)            │
│  - Implementación de interfaces del dominio                 │
│  - Acceso a base de datos (MongoDB)                         │
│  - Servicios externos (FCM, QR, PDF)                        │
└─────────────────────────────────────────────────────────────┘
```

## 🏛️ Capas del Sistema

### 1. Domain Layer (Dominio)

**Responsabilidad:** Contiene la lógica de negocio pura y las reglas del dominio.

#### Entidades (`domain/entities/`)
- `user.entity.ts` - Usuario del sistema (SUPER_ADMIN, ADMIN, STAFF, USER)
- `business.entity.ts` - Negocio/Empresa (multi-tenant)
- `staff.entity.ts` - Empleado con horarios laborales
- `service.entity.ts` - Servicio ofrecido
- `appointment.entity.ts` - Cita con estados
- `client.entity.ts` - Cliente del negocio
- `review.entity.ts` - Reseña/Calificación

#### DTOs (`domain/dtos/`)
Data Transfer Objects con validación estática:
- Validación de tipos
- Reglas de negocio
- Transformación de datos

#### Use Cases (`domain/use-cases/`)
Casos de uso específicos del negocio:
- `auth/` - Login, Register
- `availability/` - Cálculo de disponibilidad inteligente
- `business/`, `staff/`, `services/`, `appointments/` - CRUD
- `client/`, `review/` - Gestión de clientes y reseñas

#### Interfaces (`domain/repositories/`, `domain/datasources/`)
Contratos que deben implementar las capas inferiores.

### 2. Infrastructure Layer (Infraestructura)

**Responsabilidad:** Implementa las interfaces del dominio y maneja detalles técnicos.

#### Datasources (`infrastructure/datasources/`)
Acceso directo a MongoDB:
- Operaciones CRUD
- Consultas complejas
- Agregaciones

#### Repositories (`infrastructure/repositories/`)
Implementan las interfaces del dominio:
- Delegan al datasource
- Aplican mappers

#### Mappers (`infrastructure/mappers/`)
Transforman entre modelos de MongoDB y entidades del dominio:
```typescript
MongoModel → DomainEntity
```

#### Services (`infrastructure/services/`)
Servicios de infraestructura:
- `reports.service.ts` - Business Intelligence con agregaciones
- `marketing.service.ts` - QR, Deep Linking, PDFs
- `socket.service.ts` - WebSockets en tiempo real

### 3. Presentation Layer (Presentación)

**Responsabilidad:** Maneja la comunicación HTTP y WebSockets.

#### Controllers (`presentation/*/controller.ts`)
- Reciben requests HTTP
- Validan DTOs
- Invocan casos de uso
- Retornan responses

#### Routes (`presentation/*/routes.ts`)
- Definen endpoints
- Aplican middlewares
- Inyectan dependencias

#### Middlewares (`presentation/middlewares/`)
- `auth.middleware.ts` - Validación JWT
- `role.middleware.ts` - RBAC (Control de acceso)
- `upload.middleware.ts` - Multer para archivos
- `error.middleware.ts` - Manejo de errores

## 🔐 Sistema RBAC (Role-Based Access Control)

### Roles Implementados

```typescript
type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'USER';
```

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **SUPER_ADMIN** | Propietario del SaaS | Acceso total, métricas globales |
| **ADMIN** | Gerente/Suscriptor | Gestión completa de su negocio |
| **STAFF** | Empleado | Ver agenda, clientes asignados |
| **USER** | Cliente final | Agendar citas, ver historial |

### Jerarquía de Permisos

```
SUPER_ADMIN (acceso total)
    ↓
  ADMIN (su negocio)
    ↓
  STAFF (su agenda)
    ↓
  USER (sus citas)
```

## 🗄️ Estrategia de Base de Datos

### Multi-Tenancy por `businessId`

**Todas las consultas filtran por `businessId`** para garantizar aislamiento:

```typescript
// ✅ CORRECTO
await AppointmentModel.find({ businessId, status: 'PENDING' });

// ❌ INCORRECTO (fuga de datos)
await AppointmentModel.find({ status: 'PENDING' });
```

### Índices Optimizados

#### Appointment
```javascript
{ businessId: 1 }
{ staffId: 1 }
{ businessId: 1, staffId: 1 }
{ businessId: 1, startTime: 1 }
{ businessId: 1, status: 1 }
{ staffId: 1, startTime: 1, endTime: 1 }
```

#### Staff
```javascript
{ businessId: 1 }
{ businessId: 1, userId: 1 }
{ businessId: 1, isActive: 1 }
```

#### Review
```javascript
{ businessId: 1 }
{ staffId: 1 }
{ appointmentId: 1 } // unique
{ businessId: 1, staffId: 1 }
{ businessId: 1, rating: 1 }
```

## 🧠 Smart Calendar Algorithm

### Cálculo de Disponibilidad

El algoritmo calcula slots disponibles considerando:

1. **Horario laboral del Staff** (`workingHours`)
2. **Citas ya agendadas** (excluye CANCELLED y NO_SHOW)
3. **Duración del servicio**
4. **Intervalo de slots** (30 minutos)

```typescript
// Pseudocódigo
for cada slot de 30min en horario laboral:
  slotStart = currentTime
  slotEnd = currentTime + serviceDuration
  
  if NO hay overlap con citas existentes:
    agregar slot a disponibles
```

### Detección de Conflictos

```typescript
const hasConflict = (slotStart, slotEnd, bookedSlots) => {
  return bookedSlots.some(booked => {
    return (
      (slotStart >= booked.start && slotStart < booked.end) ||
      (slotEnd > booked.start && slotEnd <= booked.end) ||
      (slotStart <= booked.start && slotEnd >= booked.end)
    );
  });
};
```

## 📊 Business Intelligence

### Agregaciones MongoDB

#### 1. Reporte de Ingresos
```javascript
AppointmentModel.aggregate([
  { $match: { businessId, status: 'COMPLETED' } },
  { $lookup: { from: 'services', ... } },
  { $group: { _id: '$date', revenue: { $sum: '$price' } } }
])
```

#### 2. Ranking de Staff
```javascript
StaffModel.aggregate([
  { $lookup: { from: 'reviews', ... } },
  { $lookup: { from: 'appointments', ... } },
  { $project: { averageRating, totalSales, ... } },
  { $sort: { averageRating: -1, totalSales: -1 } }
])
```

#### 3. Tasa de Retención
```javascript
const returningClients = clients.filter(c => c.appointmentCount > 1);
const retentionRate = (returningClients / totalClients) * 100;
```

## 🎯 Sistema de Marketing Físico

### 1. Generación de Slugs

```typescript
generateSlug('Clínica Dental Sonrisas') 
// → 'clinica-dental-sonrisas'

// Con verificación de unicidad:
// clinica-dental-sonrisas-1
// clinica-dental-sonrisas-2
```

### 2. Códigos QR Dinámicos

```typescript
const qrCode = await QRCode.toDataURL(
  `https://agendly.com/join/${slug}`,
  { width: 500, margin: 2 }
);
```

### 3. Deep Linking Inteligente

```typescript
GET /api/marketing/join/clinica-dental

// Detecta User-Agent:
// iOS → App Store + businessSlug
// Android → Play Store + referrer
// Desktop → Landing page
```

### 4. Generación de PDFs

```typescript
// Flyer A4 con:
// - Logo del negocio
// - Código QR
// - Información de contacto
// - Branding de Agendly
```

## 🔔 Sistema de Tiempo Real

### WebSockets (Socket.IO)

#### Eventos del Cliente
```javascript
socket.emit('join:business', businessId);
```

#### Eventos del Servidor
```javascript
// Citas
socket.on('appointment:created', (data) => {});
socket.on('appointment:updated', (data) => {});
socket.on('appointment:cancelled', (data) => {});

// Reseñas
socket.on('review:created', (review) => {});
socket.on('review:low-rating', (alert) => {
  // Alerta automática cuando rating <= 2
});
```

### Notificaciones Push (FCM)

```typescript
// Recordatorio 24h antes
FirebaseAdapter.sendAppointmentReminder(fcmToken, {
  time: '10:00 AM',
  date: '2026-03-15'
});

// Confirmación
FirebaseAdapter.sendAppointmentConfirmation(fcmToken, {
  date: '2026-03-15'
});
```

## 🔧 Patrones de Diseño Utilizados

### 1. Repository Pattern
Abstrae el acceso a datos:
```typescript
interface Repository {
  create(data): Promise<Entity>;
  findById(id): Promise<Entity>;
  // ...
}
```

### 2. Datasource Pattern
Separa la lógica de acceso a datos:
```typescript
Repository → Datasource → MongoDB
```

### 3. Mapper Pattern
Transforma entre capas:
```typescript
Mapper.toEntity(mongoDocument) → DomainEntity
```

### 4. Dependency Injection
Inyección manual en constructores:
```typescript
const datasource = new MongoDatasource();
const repository = new RepositoryImpl(datasource);
const useCase = new UseCase(repository);
```

### 5. Factory Pattern
Creación de DTOs con validación:
```typescript
const [error, dto] = CreateDto.create(data);
if (error) throw error;
```

## 🚀 Flujo de una Request

```
1. HTTP Request
   ↓
2. Route → Middleware (Auth, RBAC)
   ↓
3. Controller → Valida DTO
   ↓
4. Use Case → Lógica de negocio
   ↓
5. Repository → Interface
   ↓
6. Datasource → MongoDB
   ↓
7. Mapper → Entity
   ↓
8. Response JSON
```

## 📝 Principios SOLID Aplicados

### Single Responsibility
Cada clase tiene una única responsabilidad.

### Open/Closed
Abierto a extensión, cerrado a modificación.

### Liskov Substitution
Las implementaciones son intercambiables.

### Interface Segregation
Interfaces específicas por funcionalidad.

### Dependency Inversion
Dependemos de abstracciones, no de implementaciones.

---

**Desarrollado con Clean Architecture y TypeScript** 🚀
