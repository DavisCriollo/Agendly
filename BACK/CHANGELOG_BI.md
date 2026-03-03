# 📊 Changelog - Business Intelligence v2.0

## ✨ Nuevas Funcionalidades

### 1. Motor de Analytics Completo

#### Dashboards Implementados:
- ✅ **Rentabilidad**: Utilidad neta, margen de ganancia, ranking de servicios
- ✅ **Eficiencia**: Puntualidad del staff, retrasos promedio
- ✅ **Retención**: Clientes nuevos vs recurrentes, tasa de No-Show, ROI por canal
- ✅ **Mapa de Calor**: Ocupación por día/hora, horas pico y tranquilas
- ✅ **Dashboard Completo**: Todos los reportes en una sola petición

### 2. Campos Analíticos Agregados

#### Service (Servicio)
```typescript
{
  costOfService: number;  // Costo operativo del servicio
  category: string;       // Categoría para agrupación
}
```

#### Appointment (Cita)
```typescript
{
  checkInTime?: Date;           // Hora real de llegada del cliente
  checkOutTime?: Date;          // Hora real de salida del cliente
  isFirstTime: boolean;         // Indica si es la primera cita del cliente
  cancellationReason?: string;  // Motivo de cancelación (si aplica)
  clientDevice: 'web' | 'ios' | 'android' | 'unknown';  // Dispositivo usado
}
```

#### Client (Cliente)
```typescript
{
  birthDate?: Date;                    // Fecha de nacimiento (segmentación demográfica)
  referredBy?: string;                 // ID del cliente que lo refirió
  source: 'qr_door' | 'web_booking' | 'app' | 'manual' | 'unknown';  // Fuente de adquisición
}
```

#### Staff (Empleado)
```typescript
{
  averageRating: number;   // Calificación promedio (0-5)
  totalReviews: number;    // Total de reseñas recibidas
}
```

### 3. Sistema de Feedback Loop

#### Actualización Automática de Rating
- Cuando se crea una reseña, se actualiza automáticamente el `averageRating` del Staff
- Se incrementa el contador `totalReviews`
- Fórmula: `newAverage = (currentAverage * totalReviews + newRating) / (totalReviews + 1)`

#### Alertas en Tiempo Real
- Evento `review:created` para todas las reseñas
- Evento `review:low-rating` cuando rating ≤ 2 (solo para admins)
- Incluye información del staff y rating actualizado

### 4. Índices Optimizados para BI

#### Nuevos Índices en Appointment:
- `businessId + customerId` (análisis de retención)
- `businessId + isFirstTime` (clientes nuevos vs recurrentes)
- `businessId + clientDevice` (análisis por plataforma)

#### Nuevos Índices en Staff:
- `businessId + averageRating` (descendente, para rankings)

#### Nuevos Índices en Client:
- `businessId + source` (ROI por canal de marketing)
- `businessId + createdAt` (análisis de crecimiento)

#### Nuevos Índices en Service:
- `businessId + category` (agrupación por categoría)

### 5. Endpoints de Analytics

```
GET /api/analytics/profitability/:businessId
GET /api/analytics/efficiency/:businessId
GET /api/analytics/retention/:businessId
GET /api/analytics/heatmap/:businessId
GET /api/analytics/dashboard/:businessId
```

**Permisos:** Solo `ADMIN` y `SUPER_ADMIN`

### 6. Agregaciones MongoDB Optimizadas

- Pipeline de rentabilidad con `$lookup` y `$group`
- Pipeline de eficiencia con cálculo de retrasos
- Pipeline de retención con análisis de clientes recurrentes
- Pipeline de mapa de calor con `$dayOfWeek` y `$hour`

---

## 🔧 Cambios Técnicos

### Entidades Actualizadas
- ✅ `ServiceEntity`: +costOfService, +category
- ✅ `AppointmentEntity`: +checkInTime, +checkOutTime, +isFirstTime, +cancellationReason, clientDevice (renombrado de clientSource)
- ✅ `ClientEntity`: +birthDate, +referredBy, +source
- ✅ `StaffEntity`: +averageRating, +totalReviews

### Modelos Mongoose Actualizados
- ✅ `ServiceModel`: Nuevos campos y índices
- ✅ `AppointmentModel`: Nuevos campos y índices
- ✅ `ClientModel`: Nuevos campos y índices
- ✅ `StaffModel`: Nuevos campos y índices

### Mappers Actualizados
- ✅ `ServiceMapper`: Mapeo de costOfService y category
- ✅ `AppointmentMapper`: Mapeo de todos los nuevos campos
- ✅ `ClientMapper`: Mapeo de birthDate, referredBy y source
- ✅ `StaffMapper`: Mapeo de averageRating y totalReviews

### Repositorios Actualizados
- ✅ `StaffRepository`: +update() method
- ✅ `StaffDatasource`: +update() method
- ✅ `StaffMongoDatasource`: Implementación de update()
- ✅ `StaffRepositoryImpl`: Implementación de update()

### Casos de Uso Actualizados
- ✅ `CreateAppointmentUseCase`: Inicializa isFirstTime y clientDevice
- ✅ `QuickBookingUseCase`: Calcula isFirstTime, usa source correcto
- ✅ `CreateServiceUseCase`: Inicializa costOfService y category
- ✅ `CreateStaffUseCase`: Inicializa averageRating y totalReviews

### Nuevos Casos de Uso
- ✅ `CreateReviewWithFeedbackUseCase`: Crea reseña y actualiza rating automáticamente

### Nuevos Servicios
- ✅ `AnalyticsService`: Motor completo de Business Intelligence

### Nuevos Controladores
- ✅ `AnalyticsController`: Endpoints para todos los dashboards

### Nuevas Rutas
- ✅ `AnalyticsRoutes`: Rutas protegidas para analytics

### DTOs Actualizados
- ✅ `CreateClientDto`: +birthDate, +referredBy, +source

### Controladores Actualizados
- ✅ `ReviewController`: Usa CreateReviewWithFeedbackUseCase
- ✅ `BookingController`: Mapea clientDevice correctamente

---

## 📚 Documentación Nueva

### Archivos Creados:
- ✅ `BUSINESS_INTELLIGENCE.md`: Guía completa de analytics
- ✅ `CHANGELOG_BI.md`: Este archivo

### Archivos Actualizados:
- ✅ `API_DOCUMENTATION.md`: Nuevos endpoints y campos
- ✅ `README.md`: Actualizado con nuevas features

---

## 🎯 Casos de Uso

### Para Gerentes/Admins:

#### Dashboard de Rentabilidad
- Ver servicios más rentables
- Identificar servicios con bajo margen
- Optimizar precios
- Eliminar servicios no rentables

#### Dashboard de Eficiencia
- Identificar staff con baja puntualidad
- Analizar causas de retrasos
- Optimizar horarios
- Implementar incentivos

#### Dashboard de Retención
- Medir tasa de retención
- Identificar canales efectivos
- Reducir No-Shows
- Optimizar inversión en marketing

#### Mapa de Calor
- Identificar horas pico
- Ajustar turnos del staff
- Promociones en horas bajas
- Planificar capacidad

---

## 🔒 Seguridad

- ✅ Todos los endpoints protegidos con JWT
- ✅ Solo `ADMIN` y `SUPER_ADMIN` tienen acceso
- ✅ Filtrado estricto por `businessId`
- ✅ Validación de parámetros de fecha

---

## 🚀 Rendimiento

### Optimizaciones:
- Índices compuestos para queries complejas
- Agregaciones MongoDB nativas (no en memoria)
- Pipeline optimizado con `$match` al inicio
- Cálculos matemáticos en la base de datos

### Tiempos Esperados:
- Dashboard completo: ~500ms (4 agregaciones en paralelo)
- Reporte individual: ~100-200ms
- Actualización de rating: <50ms

---

## 📊 Métricas de Calidad

### KPIs Implementados:

#### Rentabilidad
- Margen de Ganancia (%)
- Utilidad Neta ($)
- Servicios por Rentabilidad

#### Eficiencia
- Puntualidad (%)
- Retraso Promedio (min)
- Ranking de Staff

#### Retención
- Tasa de Retención (%)
- Tasa de No-Show (%)
- ROI por Canal

#### Ocupación
- Tasa de Ocupación (%)
- Horas Pico
- Horas Tranquilas

---

## 🔄 Compatibilidad

### Backward Compatibility:
- ✅ Todos los campos nuevos son opcionales o tienen defaults
- ✅ No rompe endpoints existentes
- ✅ Migraciones automáticas con defaults

### Breaking Changes:
- ⚠️ `clientSource` renombrado a `clientDevice` en AppointmentEntity
- ⚠️ `ClientEntity.source` ahora es requerido (default: 'unknown')

---

## 🧪 Testing

### Agregaciones Probadas:
- ✅ Rentabilidad con múltiples servicios
- ✅ Eficiencia con diferentes niveles de puntualidad
- ✅ Retención con clientes nuevos y recurrentes
- ✅ Mapa de calor con diferentes patrones de ocupación

### Edge Cases Manejados:
- ✅ Sin citas completadas → Retorna valores en 0
- ✅ Sin reseñas → averageRating = 0
- ✅ División por cero → Manejo seguro
- ✅ Fechas inválidas → Validación en DTO

---

## 📱 Integración Frontend

### React/Vue:
```javascript
const dashboard = await fetch(`/api/analytics/dashboard/${businessId}?startDate=...&endDate=...`);
```

### Flutter:
```dart
final response = await http.get(Uri.parse('$baseUrl/api/analytics/dashboard/$businessId'));
```

---

## 🎨 Visualizaciones Recomendadas

- **Rentabilidad**: Barras, Pastel, Línea de tiempo
- **Eficiencia**: Barras horizontales, Medidor, Tabla
- **Retención**: Dona, Embudo, KPI Cards
- **Mapa de Calor**: Heat Map 7x24, Listas

---

## 🔮 Próximas Mejoras Sugeridas

- [ ] Predicción de demanda con ML
- [ ] Análisis de sentimiento en comentarios
- [ ] Cohort analysis
- [ ] Lifetime Value (LTV) por cliente
- [ ] Exportación a PDF/Excel
- [ ] Alertas inteligentes automáticas
- [ ] Recomendaciones basadas en IA

---

## 📝 Notas de Migración

### Para Bases de Datos Existentes:

Los nuevos campos tienen valores por defecto:
- `costOfService`: 0
- `category`: 'General'
- `isFirstTime`: false
- `clientDevice`: 'unknown'
- `source`: 'unknown'
- `averageRating`: 0
- `totalReviews`: 0

Los índices se crean automáticamente al iniciar la aplicación.

---

**Versión:** 2.0.0  
**Fecha:** Marzo 2026  
**Estado:** ✅ Producción Ready
