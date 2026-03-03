# 📊 Business Intelligence - Agendly Analytics

## 🎯 Motor de Reportes Avanzados

Agendly incluye un motor completo de Business Intelligence con agregaciones optimizadas de MongoDB para análisis profundo del negocio.

---

## 📈 Dashboards Disponibles

### 1. 💰 Rentabilidad (Profitability)

**Endpoint:**
```http
GET /api/analytics/profitability/:businessId?startDate=2026-01-01&endDate=2026-03-31
```

**Métricas:**
- Ingresos totales
- Costos totales
- Utilidad neta (Revenue - Cost)
- Margen de ganancia (%)
- Ranking de servicios más rentables

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 15000,
    "totalCost": 4500,
    "netProfit": 10500,
    "profitMargin": 70.0,
    "topServices": [
      {
        "serviceId": "s1",
        "serviceName": "Consulta General",
        "category": "Consultas",
        "totalBookings": 120,
        "revenue": 6000,
        "cost": 1800,
        "netProfit": 4200,
        "profitMargin": 70.0
      },
      {
        "serviceId": "s2",
        "serviceName": "Servicio Pro",
        "category": "Tratamientos",
        "totalBookings": 80,
        "revenue": 8000,
        "cost": 2400,
        "netProfit": 5600,
        "profitMargin": 70.0
      }
    ]
  }
}
```

**Casos de uso:**
- Identificar servicios más rentables
- Optimizar precios
- Eliminar servicios no rentables
- Planificar inversiones

---

### 2. ⚡ Eficiencia (Punctuality)

**Endpoint:**
```http
GET /api/analytics/efficiency/:businessId?startDate=2026-01-01&endDate=2026-03-31
```

**Métricas:**
- Puntualidad del staff (%)
- Citas a tiempo vs tardías
- Retraso promedio en minutos
- Ranking de staff por puntualidad

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "staffPerformance": [
      {
        "staffId": "st1",
        "staffName": "Dr. Juan Pérez",
        "totalAppointments": 100,
        "onTimeAppointments": 95,
        "lateAppointments": 5,
        "punctualityRate": 95.0,
        "averageDelayMinutes": 3.5
      },
      {
        "staffId": "st2",
        "staffName": "Dra. María García",
        "totalAppointments": 80,
        "onTimeAppointments": 72,
        "lateAppointments": 8,
        "punctualityRate": 90.0,
        "averageDelayMinutes": 5.2
      }
    ],
    "overallPunctuality": 92.5
  }
}
```

**Cómo funciona:**
- Compara `startTime` vs `checkInTime`
- Si `checkInTime > startTime` → Tardío
- Calcula retraso en minutos
- Genera ranking de puntualidad

**Casos de uso:**
- Identificar staff con problemas de puntualidad
- Optimizar horarios
- Mejorar experiencia del cliente
- Incentivos por puntualidad

---

### 3. 🔄 Retención (Retention)

**Endpoint:**
```http
GET /api/analytics/retention/:businessId
```

**Métricas:**
- Total de clientes
- Clientes nuevos vs recurrentes
- Tasa de retención (%)
- Tasa de No-Show (%)
- Dinero perdido por No-Shows
- Clientes por fuente de adquisición

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "totalClients": 200,
    "newClients": 50,
    "returningClients": 150,
    "retentionRate": 75.0,
    "noShowRate": 8.5,
    "noShowCount": 17,
    "lostRevenue": 850,
    "clientsBySource": [
      {
        "source": "web_booking",
        "count": 80,
        "percentage": 40.0
      },
      {
        "source": "app",
        "count": 60,
        "percentage": 30.0
      },
      {
        "source": "qr_door",
        "count": 40,
        "percentage": 20.0
      },
      {
        "source": "manual",
        "count": 20,
        "percentage": 10.0
      }
    ]
  }
}
```

**Casos de uso:**
- Medir efectividad de marketing
- Identificar canales más efectivos
- Reducir tasa de No-Show
- Estrategias de fidelización

---

### 4. 🔥 Mapa de Calor (Heat Map)

**Endpoint:**
```http
GET /api/analytics/heatmap/:businessId?startDate=2026-01-01&endDate=2026-03-31
```

**Métricas:**
- Ocupación por día de la semana y hora
- Horas pico
- Horas tranquilas
- Tasa de ocupación (%)

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "heatMap": [
      {
        "dayOfWeek": 1,
        "hour": 9,
        "appointmentCount": 15,
        "occupancyRate": 75
      },
      {
        "dayOfWeek": 1,
        "hour": 10,
        "appointmentCount": 20,
        "occupancyRate": 100
      },
      {
        "dayOfWeek": 1,
        "hour": 14,
        "appointmentCount": 5,
        "occupancyRate": 25
      }
    ],
    "peakHours": [
      { "dayOfWeek": 1, "hour": 10, "count": 20 },
      { "dayOfWeek": 3, "hour": 11, "count": 18 },
      { "dayOfWeek": 5, "hour": 9, "count": 17 }
    ],
    "quietHours": [
      { "dayOfWeek": 6, "hour": 15, "count": 2 },
      { "dayOfWeek": 1, "hour": 16, "count": 3 },
      { "dayOfWeek": 4, "hour": 14, "count": 4 }
    ]
  }
}
```

**Días de la semana:**
- 1 = Lunes
- 2 = Martes
- 3 = Miércoles
- 4 = Jueves
- 5 = Viernes
- 6 = Sábado
- 7 = Domingo

**Casos de uso:**
- Optimizar horarios del staff
- Identificar horas de baja demanda
- Planificar promociones en horas tranquilas
- Ajustar capacidad operativa

---

### 5. 📊 Dashboard Completo

**Endpoint:**
```http
GET /api/analytics/dashboard/:businessId?startDate=2026-01-01&endDate=2026-03-31
```

**Respuesta:**
Combina todos los reportes en una sola llamada:
```json
{
  "success": true,
  "data": {
    "profitability": { ... },
    "efficiency": { ... },
    "retention": { ... },
    "heatMap": { ... }
  },
  "message": "Dashboard completo generado exitosamente"
}
```

**Ventaja:**
- Una sola petición HTTP
- Carga paralela de datos
- Optimizado para dashboards

---

## 🔍 Campos Analíticos Agregados

### Service (Servicio)
```typescript
{
  costOfService: number;  // Costo operativo
  category: string;       // Categoría para agrupación
}
```

**Uso:**
- Calcular utilidad neta por servicio
- Agrupar servicios por categoría
- Análisis de rentabilidad

### Appointment (Cita)
```typescript
{
  checkInTime?: Date;           // Hora real de llegada
  checkOutTime?: Date;          // Hora real de salida
  isFirstTime: boolean;         // Primera cita del cliente
  cancellationReason?: string;  // Motivo de cancelación
  clientDevice: 'web' | 'ios' | 'android';  // Dispositivo usado
}
```

**Uso:**
- Medir puntualidad del staff
- Identificar clientes nuevos vs recurrentes
- Analizar motivos de cancelación
- Analítica por plataforma

### Client (Cliente)
```typescript
{
  birthDate?: Date;                    // Fecha de nacimiento
  referredBy?: string;                 // Referido por (ID)
  source: 'qr_door' | 'web_booking' | 'app' | 'manual';  // Fuente de adquisición
}
```

**Uso:**
- Segmentación demográfica
- Programas de referidos
- ROI por canal de marketing
- Análisis de conversión

### Staff (Empleado)
```typescript
{
  averageRating: number;   // Calificación promedio (0-5)
  totalReviews: number;    // Total de reseñas
}
```

**Uso:**
- Ranking automático de staff
- Incentivos por desempeño
- Identificación de problemas
- Mejora continua

---

## 🔄 Sistema de Feedback Loop

### Actualización Automática de Rating

Cuando se crea una reseña:

1. **Se calcula el nuevo promedio:**
   ```typescript
   newAverage = (currentAverage * totalReviews + newRating) / (totalReviews + 1)
   ```

2. **Se actualiza el staff automáticamente:**
   ```typescript
   staff.averageRating = newAverage;
   staff.totalReviews += 1;
   ```

3. **Se emite evento por WebSocket:**
   ```javascript
   socket.on('review:created', (data) => {
     console.log('Nueva reseña:', data.review);
     console.log('Rating actualizado:', data.staffUpdate.averageRating);
   });
   ```

4. **Alerta si rating ≤ 2:**
   ```javascript
   socket.on('review:low-rating', (data) => {
     // Solo para admins
     showAlert({
       title: '⚠️ Calificación Baja',
       staffId: data.staffId,
       currentRating: data.currentRating,
       review: data.review
     });
   });
   ```

---

## 📊 Índices Optimizados para BI

### Appointment
```javascript
{ businessId: 1, staffId: 1 }
{ businessId: 1, startTime: 1 }
{ businessId: 1, status: 1 }
{ businessId: 1, customerId: 1 }      // Nuevo
{ businessId: 1, isFirstTime: 1 }     // Nuevo
{ businessId: 1, clientDevice: 1 }    // Nuevo
{ staffId: 1, startTime: 1, endTime: 1 }
```

### Service
```javascript
{ businessId: 1 }
{ businessId: 1, category: 1 }        // Nuevo
{ businessId: 1, isActive: 1 }
```

### Client
```javascript
{ businessId: 1 }
{ businessId: 1, email: 1 }
{ businessId: 1, source: 1 }          // Nuevo
{ businessId: 1, createdAt: 1 }       // Nuevo
```

### Staff
```javascript
{ businessId: 1 }
{ businessId: 1, userId: 1 }
{ businessId: 1, isActive: 1 }
{ businessId: 1, averageRating: -1 }  // Nuevo (descendente)
```

---

## 🎯 Casos de Uso por Dashboard

### Dashboard de Rentabilidad

**Para:** Gerente/Admin
**Objetivo:** Maximizar ganancias

**Acciones:**
1. Ver servicios más rentables
2. Identificar servicios con bajo margen
3. Ajustar precios
4. Eliminar servicios no rentables
5. Promocionar servicios de alto margen

**Ejemplo:**
```
Servicio A: $100 - $30 = $70 (70% margen) ✅ Promocionar
Servicio B: $50 - $45 = $5 (10% margen) ⚠️ Revisar precio
Servicio C: $80 - $90 = -$10 ❌ Eliminar o ajustar
```

---

### Dashboard de Eficiencia

**Para:** Gerente/Admin
**Objetivo:** Mejorar puntualidad y servicio

**Acciones:**
1. Identificar staff con baja puntualidad
2. Analizar causas de retrasos
3. Optimizar horarios
4. Capacitación específica
5. Incentivos por puntualidad

**Ejemplo:**
```
Staff A: 95% puntual, 3min retraso promedio ✅ Excelente
Staff B: 75% puntual, 12min retraso promedio ⚠️ Mejorar
Staff C: 60% puntual, 20min retraso promedio ❌ Acción urgente
```

---

### Dashboard de Retención

**Para:** Gerente/Marketing
**Objetivo:** Fidelizar clientes

**Acciones:**
1. Medir tasa de retención
2. Identificar canales efectivos
3. Reducir No-Shows
4. Programas de fidelización
5. Optimizar inversión en marketing

**Ejemplo:**
```
Retención: 75% ✅ Bueno
No-Show: 8.5% ⚠️ Mejorar (recordatorios automáticos)

Fuentes:
- Web Booking: 40% → Invertir más en SEO
- App: 30% → Promocionar descarga
- QR Puerta: 20% → Más visible
- Manual: 10% → Automatizar
```

---

### Mapa de Calor

**Para:** Gerente/Operaciones
**Objetivo:** Optimizar capacidad

**Acciones:**
1. Identificar horas pico
2. Ajustar turnos del staff
3. Promociones en horas bajas
4. Planificar capacidad
5. Reducir tiempos muertos

**Ejemplo:**
```
Lunes 10:00 AM → 100% ocupación ✅ Hora pico
Lunes 14:00 PM → 25% ocupación ⚠️ Promoción 2x1
Sábado 15:00 PM → 10% ocupación ❌ Cerrar o promocionar
```

---

## 🔧 Implementación Técnica

### Agregaciones MongoDB

#### Rentabilidad
```javascript
AppointmentModel.aggregate([
  { $match: { businessId, status: 'COMPLETED' } },
  { $lookup: { from: 'services', ... } },
  { $group: { 
      revenue: { $sum: '$service.price' },
      cost: { $sum: '$service.costOfService' }
  }},
  { $project: { 
      netProfit: { $subtract: ['$revenue', '$cost'] },
      profitMargin: { $divide: ['$netProfit', '$revenue'] }
  }}
])
```

#### Eficiencia
```javascript
AppointmentModel.aggregate([
  { $match: { businessId, checkInTime: { $exists: true } } },
  { $project: {
      isOnTime: { $lte: ['$checkInTime', '$startTime'] },
      delayMinutes: { $divide: [
        { $subtract: ['$checkInTime', '$startTime'] },
        60000
      ]}
  }},
  { $group: {
      onTimeAppointments: { $sum: { $cond: ['$isOnTime', 1, 0] } },
      punctualityRate: { $avg: { $cond: ['$isOnTime', 100, 0] } }
  }}
])
```

#### Mapa de Calor
```javascript
AppointmentModel.aggregate([
  { $match: { businessId, status: { $in: ['COMPLETED', 'CONFIRMED'] } } },
  { $project: {
      dayOfWeek: { $dayOfWeek: '$startTime' },
      hour: { $hour: '$startTime' }
  }},
  { $group: {
      _id: { dayOfWeek: '$dayOfWeek', hour: '$hour' },
      appointmentCount: { $sum: 1 }
  }},
  { $sort: { '_id.dayOfWeek': 1, '_id.hour': 1 } }
])
```

---

## 📱 Integración con Frontend

### React/Vue Dashboard

```javascript
import { useState, useEffect } from 'react';

function AnalyticsDashboard({ businessId }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboard = async () => {
      const response = await fetch(
        `/api/analytics/dashboard/${businessId}?startDate=2026-01-01&endDate=2026-03-31`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Client-Source': 'web'
          }
        }
      );
      
      const data = await response.json();
      if (data.success) {
        setDashboard(data.data);
      }
      setLoading(false);
    };
    
    fetchDashboard();
  }, [businessId]);
  
  if (loading) return <Spinner />;
  
  return (
    <div>
      <ProfitabilityChart data={dashboard.profitability} />
      <EfficiencyChart data={dashboard.efficiency} />
      <RetentionChart data={dashboard.retention} />
      <HeatMapChart data={dashboard.heatMap} />
    </div>
  );
}
```

### Flutter Dashboard

```dart
class AnalyticsDashboard extends StatefulWidget {
  final String businessId;
  
  @override
  _AnalyticsDashboardState createState() => _AnalyticsDashboardState();
}

class _AnalyticsDashboardState extends State<AnalyticsDashboard> {
  Map<String, dynamic>? dashboard;
  bool loading = true;
  
  @override
  void initState() {
    super.initState();
    fetchDashboard();
  }
  
  Future<void> fetchDashboard() async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/analytics/dashboard/${widget.businessId}?startDate=2026-01-01&endDate=2026-03-31'),
      headers: {
        'Authorization': 'Bearer $token',
        'X-Client-Source': Platform.isIOS ? 'mobile_ios' : 'mobile_android',
      },
    );
    
    final data = jsonDecode(response.body);
    if (data['success']) {
      setState(() {
        dashboard = data['data'];
        loading = false;
      });
    }
  }
  
  @override
  Widget build(BuildContext context) {
    if (loading) return CircularProgressIndicator();
    
    return Column(
      children: [
        ProfitabilityCard(data: dashboard!['profitability']),
        EfficiencyCard(data: dashboard!['efficiency']),
        RetentionCard(data: dashboard!['retention']),
        HeatMapCard(data: dashboard!['heatMap']),
      ],
    );
  }
}
```

---

## 🎨 Visualizaciones Recomendadas

### Rentabilidad
- **Gráfico de barras** - Servicios por utilidad neta
- **Gráfico de pastel** - Distribución de ingresos por categoría
- **Línea de tiempo** - Evolución de utilidad neta

### Eficiencia
- **Gráfico de barras horizontales** - Staff por puntualidad
- **Medidor** - Puntualidad general del negocio
- **Tabla** - Detalles de retrasos

### Retención
- **Gráfico de dona** - Nuevos vs Recurrentes
- **Embudo** - Conversión por fuente
- **KPI Cards** - Tasa de retención y No-Show

### Mapa de Calor
- **Heat Map 7x24** - Días vs Horas
- **Lista** - Top 5 horas pico
- **Lista** - Top 5 horas tranquilas

---

## 🔐 Seguridad y Permisos

### Acceso a Analytics

- **ADMIN**: Puede ver analytics de su negocio
- **SUPER_ADMIN**: Puede ver analytics de todos los negocios
- **STAFF**: Sin acceso
- **USER**: Sin acceso

### Middleware de Protección

```typescript
[
  AuthMiddleware.validateJWT,
  RoleMiddleware.validateRole(['ADMIN', 'SUPER_ADMIN'])
]
```

---

## 📊 KPIs Principales

### Rentabilidad
- **Margen de Ganancia**: >60% = Excelente, 40-60% = Bueno, <40% = Revisar
- **Utilidad Neta**: Objetivo mensual definido por negocio

### Eficiencia
- **Puntualidad**: >90% = Excelente, 80-90% = Bueno, <80% = Mejorar
- **Retraso Promedio**: <5min = Excelente, 5-10min = Aceptable, >10min = Problema

### Retención
- **Tasa de Retención**: >70% = Excelente, 50-70% = Bueno, <50% = Crítico
- **Tasa de No-Show**: <5% = Excelente, 5-10% = Aceptable, >10% = Problema

### Ocupación
- **Tasa de Ocupación**: >80% = Alta demanda, 50-80% = Normal, <50% = Baja

---

## 🚀 Próximas Mejoras Sugeridas

### Analytics Avanzados
- [ ] Predicción de demanda con ML
- [ ] Análisis de sentimiento en comentarios
- [ ] Cohort analysis
- [ ] Lifetime Value (LTV) por cliente

### Exportación
- [ ] Exportar reportes a PDF
- [ ] Exportar a Excel/CSV
- [ ] Envío automático por email

### Alertas Inteligentes
- [ ] Alertas de baja ocupación
- [ ] Alertas de baja rentabilidad
- [ ] Alertas de alta tasa de No-Show
- [ ] Recomendaciones automáticas

---

**El motor de Business Intelligence está completamente implementado y listo para producción.** 📊🚀
