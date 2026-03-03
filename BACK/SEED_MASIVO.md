# 🌱 Seed Masivo - Clínica Dental Élite

## 📋 Descripción

Script de seed masivo diseñado para pruebas de estrés, analítica y demostración del sistema Agendly. Genera datos realistas para simular una clínica dental en operación.

## 🚀 Ejecución

```bash
# Opción 1
npm run seed

# Opción 2
npm run db:seed

# Opción 3 (directa)
ts-node src/infrastructure/seeds/seed.ts
```

## 📊 Datos Generados

### 🏢 Business (1)
- **Nombre:** Clínica Dental Élite
- **Slug:** `clinica-elite`
- **Plan:** PRO
- **Colores:** Azul (#0066CC, #00AAFF)

### 👤 Usuarios (55 total)

#### Administrador (1)
- **Email:** admin@clinica-elite.com
- **Password:** 123456789
- **Rol:** ADMIN

#### Staff (4)
| Nombre | Especialidad | Email | Horario |
|--------|--------------|-------|---------|
| Dr. Carlos Mendoza | Odontólogo General | dr.carlos.mendoza@clinica-elite.com | L-V 9:00-17:00 |
| Dra. Ana Martínez | Higienista Dental | dra.ana.martínez@clinica-elite.com | L-S 10:00-18:00 |
| Dr. Roberto Sánchez | Cirujano Maxilofacial | dr.roberto.sánchez@clinica-elite.com | M,J,V 14:00-20:00 |
| Dra. Laura Fernández | Ortodoncista | dra.laura.fernández@clinica-elite.com | L,M,V 8:00-16:00 |

**Password para todos:** 123456789

#### Clientes (50)
- Generados con **Faker.js** (nombres, emails, teléfonos realistas)
- Distribución de fuentes:
  - 25% `qr_door` (QR en puerta)
  - 25% `web_booking` (Reserva web)
  - 25% `app` (App móvil)
  - 25% `manual` (Registro manual)

### 🔧 Servicios (6)

| Servicio | Duración | Precio | Costo | Categoría | Utilidad |
|----------|----------|--------|-------|-----------|----------|
| Limpieza Dental | 30 min | $500 | $150 | Preventiva | $350 |
| Consulta General | 20 min | $300 | $100 | Consulta | $200 |
| Extracción Simple | 45 min | $800 | $200 | Cirugía | $600 |
| Blanqueamiento Dental | 60 min | $2,500 | $800 | Estética | $1,700 |
| Endodoncia | 90 min | $3,500 | $1,200 | Especializada | $2,300 |
| Ortodoncia (Revisión) | 15 min | $400 | $100 | Ortodoncia | $300 |

### 📅 Citas (50)

#### Distribución por Estado
- ✅ **30 COMPLETED** (Completadas)
  - Con `checkInTime` y `checkOutTime`
  - Variaciones de -10 a +15 min en check-in
  - Variaciones de -5 a +20 min en check-out
  - Todas tienen review asociada
- ⏳ **10 PENDING** (Pendientes)
  - Fechas futuras (próximo mes)
- ❌ **5 CANCELLED** (Canceladas)
  - Con razón de cancelación
- 🚫 **5 NO_SHOW** (No se presentaron)

#### Rango Temporal
- **Históricas:** Últimos 3 meses
- **Futuras:** Próximo mes

#### Características Especiales
- 📸 **10 citas con multimedia** (URLs de fotos)
- 🔄 **70% clientes nuevos**, 30% recurrentes
- 📱 Distribución de dispositivos: web, iOS, Android, unknown

### ⭐ Reviews (30)

- **Cantidad:** 1 review por cada cita completada
- **Ratings:** Entre 3 y 5 estrellas (realista)
- **Comentarios:** Variados y positivos
- **Actualización automática:** Los ratings del staff se calculan y actualizan automáticamente

## 🎯 Casos de Uso para Pruebas

### 1. Business Intelligence
- ✅ Cálculo de utilidad neta por servicio
- ✅ Análisis de puntualidad del staff
- ✅ Tasa de retención de clientes
- ✅ Distribución de fuentes de adquisición
- ✅ Ranking de staff por rating
- ✅ Servicios más rentables

### 2. Smart Calendar
- ✅ Disponibilidad con horarios variados
- ✅ Conflictos de agenda
- ✅ Citas superpuestas
- ✅ Días libres del staff

### 3. Reportes de Eficiencia
- ✅ Puntualidad (check-in vs hora pactada)
- ✅ Duración real vs estimada
- ✅ Tasa de no-show
- ✅ Tasa de cancelación

### 4. Marketing y Conversión
- ✅ ROI por canal de adquisición
- ✅ Conversión de clientes nuevos a recurrentes
- ✅ Efectividad del QR físico
- ✅ Tasa de conversión web booking

### 5. Gestión de Staff
- ✅ Comparación de ratings
- ✅ Productividad (citas por día)
- ✅ Especialización por servicio
- ✅ Feedback de clientes

## 🔍 Consultas de Prueba

### MongoDB Shell

```javascript
// Ver distribución de fuentes de clientes
db.clients.aggregate([
  { $group: { _id: "$source", count: { $sum: 1 } } }
])

// Ver citas por estado
db.appointments.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])

// Ver staff con mejor rating
db.staffs.find({}).sort({ averageRating: -1 })

// Ver servicios más rentables
db.services.aggregate([
  { $project: { 
      name: 1, 
      profit: { $subtract: ["$price", "$costOfService"] } 
    } 
  },
  { $sort: { profit: -1 } }
])

// Ver puntualidad del staff
db.appointments.aggregate([
  { $match: { status: "COMPLETED" } },
  { $project: {
      staffId: 1,
      delay: { 
        $divide: [
          { $subtract: ["$checkInTime", "$startTime"] },
          60000
        ]
      }
    }
  },
  { $group: {
      _id: "$staffId",
      avgDelay: { $avg: "$delay" }
    }
  }
])
```

## 📈 Métricas Esperadas

### Dashboard Principal
- **Utilidad Neta Total:** ~$35,000 - $45,000 (30 citas completadas)
- **Tasa de Retención:** 30%
- **Tasa de No-Show:** 10%
- **Tasa de Cancelación:** 10%
- **Rating Promedio Staff:** 4.0 - 4.5 ⭐

### Por Canal de Adquisición
- QR Door: 12-13 clientes
- Web Booking: 12-13 clientes
- App: 12-13 clientes
- Manual: 12-13 clientes

### Por Staff
- Cada staff tiene entre 5-10 citas completadas
- Ratings individuales varían entre 3.8 y 4.7

## 🔄 Re-ejecución

El script limpia todas las colecciones antes de insertar, por lo que es seguro ejecutarlo múltiples veces:

```bash
# Limpiar y regenerar datos
npm run seed
```

**⚠️ ADVERTENCIA:** Esto eliminará TODOS los datos existentes en la base de datos.

## 🛠️ Personalización

Para modificar los datos generados, edita las constantes en `seed.ts`:

```typescript
// Cantidad de clientes
Array.from({ length: 50 }, ...)  // Cambiar 50 por el número deseado

// Estados de citas
const APPOINTMENT_STATUSES = {
  COMPLETED: 30,  // Modificar cantidades
  PENDING: 10,
  CANCELLED: 5,
  NO_SHOW: 5,
};

// Servicios
const DENTAL_SERVICES = [
  // Agregar o modificar servicios
];
```

## 📚 Dependencias

- **@faker-js/faker:** Generación de datos realistas
- **bcryptjs:** Hash de contraseñas
- **mongoose:** ODM para MongoDB

## 🎓 Notas Técnicas

### Optimización
- Usa `Promise.all()` para inserciones paralelas
- Índices de MongoDB optimizados para consultas BI
- Transacciones implícitas por operación

### Validación
- Todos los datos pasan por DTOs y validadores
- Relaciones (IDs) verificadas automáticamente
- Timestamps generados por Mongoose

### Performance
- Tiempo de ejecución: ~25-30 segundos
- 55 usuarios + 50 citas + 30 reviews
- Sin carga en memoria (streaming)

## 🐛 Troubleshooting

### Error: MongoDB no conecta
```bash
# Verificar que Docker esté corriendo
docker ps

# Levantar MongoDB
docker-compose up -d
```

### Error: TypeScript compilation
```bash
# Reinstalar dependencias
npm install

# Verificar versión de Node
node --version  # Debe ser >= 18
```

### Error: Duplicate key
```bash
# Limpiar manualmente la BD
mongosh agendly --eval "db.dropDatabase()"

# Re-ejecutar seed
npm run seed
```

## 📞 Soporte

Para más información sobre el sistema Agendly, consulta:
- `README.md` - Guía general
- `API_DOCUMENTATION.md` - Endpoints disponibles
- `BUSINESS_INTELLIGENCE.md` - Dashboards y métricas
