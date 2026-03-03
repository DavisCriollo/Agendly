# 🚀 Agendly - Sistema de Citas Multi-Tenant

Sistema completo de gestión de citas con **Backend Node.js/TypeScript** y **Frontend React/TypeScript**, diseñado con Clean Architecture y Business Intelligence avanzado.

---

## 📁 Estructura del Proyecto

```
APP-Agendly/
├── BACK/                    # Backend API (Node.js + TypeScript)
│   ├── src/
│   │   ├── domain/         # Entidades, DTOs, Interfaces
│   │   ├── infrastructure/ # Datasources, Repositorios, Servicios
│   │   ├── presentation/   # Controladores, Rutas, Middlewares
│   │   └── config/         # Configuración
│   ├── package.json
│   └── .env
├── WEB/                     # Frontend Web (React + Vite + TypeScript)
│   ├── src/
│   │   ├── pages/          # Páginas principales
│   │   ├── components/     # Componentes reutilizables
│   │   ├── services/       # API services
│   │   └── App.tsx
│   ├── package.json
│   └── .env
├── docker-compose.yml       # MongoDB en Docker
└── README.md               # Este archivo
```

---

## 🎯 Características Principales

### Backend (BACK/)
- ✅ **Clean Architecture** con TypeScript
- ✅ **Multi-Tenant** con aislamiento por `businessId`
- ✅ **RBAC**: SUPER_ADMIN, ADMIN, STAFF, USER
- ✅ **Smart Calendar**: Disponibilidad inteligente
- ✅ **Business Intelligence Avanzado**:
  - 💰 Rentabilidad (utilidad neta, margen de ganancia)
  - ⚡ Eficiencia (puntualidad del staff)
  - 🔄 Retención (clientes nuevos vs recurrentes, No-Show)
  - 🔥 Mapa de Calor (ocupación por día/hora)
- ✅ **Feedback Loop**: Actualización automática de rating
- ✅ **Marketing Físico**: QR, Deep Linking, PDFs
- ✅ **WebSockets**: Actualizaciones en tiempo real
- ✅ **FCM**: Notificaciones push

### Frontend (WEB/)
- ✅ **React 18** con Vite
- ✅ **TypeScript** para type-safety
- ✅ **Tailwind CSS** para estilos
- ✅ **Recharts** para gráficas
- ✅ **React Router** para navegación
- ✅ **Axios** para peticiones HTTP
- ✅ **Dashboard Ejecutivo** con KPIs y gráficas
- ✅ **Gestión de Staff** con horarios
- ✅ **Gestión de Clientes** con búsqueda
- ✅ **Marketing** con QR y Deep Links

---

## 🚀 Guía de Inicio Rápido

### Requisitos Previos

- **Node.js** 18+ ([Descargar](https://nodejs.org/))
- **Docker** y Docker Compose ([Descargar](https://www.docker.com/))
- **Git** (opcional)

---

### Paso 1: Levantar MongoDB con Docker

```bash
# En la raíz del proyecto (APP-Agendly/)
docker-compose up -d
```

Esto levantará MongoDB en `localhost:27017`. Los datos se persistirán en `./data/db`.

**Verificar que MongoDB está corriendo:**
```bash
docker ps
```

Deberías ver un contenedor llamado `agendly-mongodb`.

---

### Paso 2: Configurar y Ejecutar el Backend

```bash
# Ir a la carpeta BACK
cd BACK

# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
cp .env.example .env

# Ejecutar seed masivo con datos de prueba (RECOMENDADO)
npm run seed

# Iniciar servidor en modo desarrollo
npm run dev
```

El backend estará corriendo en **http://localhost:3000**

**🌱 Seed Masivo - Datos Generados:**
- 🏢 1 Business: **Clínica Dental Élite**
- 👤 55 Usuarios (1 admin, 4 staff, 50 clientes)
- 🔧 6 Servicios dentales con precios reales
- 📅 50 Citas (30 completadas, 10 pendientes, 5 canceladas, 5 no-show)
- ⭐ 30 Reviews con ratings de 3-5 estrellas

**Credenciales de acceso:**
- **Admin**: `admin@clinica-elite.com` / `123456789`
- **Staff**: `dr.carlos.mendoza@clinica-elite.com` / `123456789`
- **Cliente**: Ver consola después del seed

📚 **Documentación completa:** `BACK/SEED_MASIVO.md`

---

### Paso 3: Configurar y Ejecutar el Frontend

```bash
# Abrir una nueva terminal y ir a la carpeta WEB
cd WEB

# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
cp .env.example .env

# Iniciar aplicación en modo desarrollo
npm run dev
```

El frontend estará corriendo en **http://localhost:5173**

---

### Paso 4: Acceder a la Aplicación

1. Abrir navegador en **http://localhost:5173**
2. Iniciar sesión con las credenciales de prueba
3. Explorar el Dashboard y las funcionalidades

---

## 🔧 Comandos Útiles

### Docker (MongoDB)

```bash
# Levantar MongoDB
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener MongoDB
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: borra todos los datos)
docker-compose down -v
```

### Backend (BACK/)

```bash
# Modo desarrollo (con hot-reload)
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar en producción
npm start

# Ejecutar seed de datos
npm run db:seed

# Ver logs en tiempo real
# (los logs aparecen en la consola)
```

### Frontend (WEB/)

```bash
# Modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview

# Linter
npm run lint
```

---

## 📊 Endpoints Principales del Backend

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Analytics (Business Intelligence)
- `GET /api/analytics/dashboard/:businessId` - Dashboard completo
- `GET /api/analytics/profitability/:businessId` - Rentabilidad
- `GET /api/analytics/efficiency/:businessId` - Eficiencia
- `GET /api/analytics/retention/:businessId` - Retención
- `GET /api/analytics/heatmap/:businessId` - Mapa de calor

### Gestión
- `GET /api/staff/:businessId` - Listar staff
- `GET /api/clients/:businessId` - Listar clientes
- `GET /api/appointments/:businessId` - Listar citas
- `GET /api/services/:businessId` - Listar servicios

### Marketing
- `GET /api/marketing/welcome-kit/:businessId` - Kit de bienvenida
- `GET /api/marketing/flyer/:businessId` - Descargar flyer PDF

### Booking Público
- `GET /booking/:slug` - Información del negocio
- `GET /booking/:slug/availability` - Disponibilidad
- `POST /booking/:slug/book` - Crear reserva rápida

**Documentación completa:** Ver `BACK/API_DOCUMENTATION.md` y `BACK/BUSINESS_INTELLIGENCE.md`

---

## 🎨 Estructura del Frontend

### Páginas Principales

- **Login** (`/login`) - Autenticación
- **Dashboard** (`/`) - Panel principal con KPIs y gráficas
- **Staff** (`/staff`) - Gestión de empleados y horarios
- **Clients** (`/clients`) - Gestión de clientes
- **Marketing** (`/marketing`) - QR codes y deep links

### Componentes

- **Layout** - Sidebar y navegación principal
- **Dashboard Charts** - Gráficas con Recharts

### Servicios API

Todos los servicios están en `src/services/api.ts`:
- `authService` - Autenticación
- `analyticsService` - Business Intelligence
- `staffService` - Gestión de staff
- `clientService` - Gestión de clientes
- `appointmentService` - Gestión de citas
- `marketingService` - Marketing

---

## 🔐 Variables de Entorno

### Backend (BACK/.env)

```env
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/agendly

# JWT
JWT_SEED=your-super-secret-jwt-seed
JWT_EXPIRES_IN=7d

# Firebase (para FCM)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-email
FIREBASE_PRIVATE_KEY="your-key"

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Base URL
BASE_URL=https://agendly.com
```

### Frontend (WEB/.env)

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Agendly
```

---

## 🧪 Testing

### Backend

```bash
cd BACK

# Verificar compilación
npm run build

# Ejecutar seed para datos de prueba
npm run db:seed
```

### Frontend

```bash
cd WEB

# Verificar compilación
npm run build

# Ejecutar linter
npm run lint
```

---

## 📦 Dependencias Principales

### Backend
- **express** - Framework web
- **mongoose** - ODM para MongoDB
- **socket.io** - WebSockets
- **jsonwebtoken** - Autenticación JWT
- **bcryptjs** - Hash de contraseñas
- **firebase-admin** - Notificaciones push
- **qrcode** - Generación de QR
- **pdfkit** - Generación de PDFs

### Frontend
- **react** - Librería UI
- **react-router-dom** - Enrutamiento
- **axios** - Cliente HTTP
- **recharts** - Gráficas
- **lucide-react** - Iconos
- **tailwindcss** - Estilos
- **date-fns** - Manejo de fechas

---

## 🚀 Despliegue en Producción

### Backend

1. **Configurar variables de entorno de producción**
2. **Compilar TypeScript:**
   ```bash
   npm run build
   ```
3. **Usar MongoDB Atlas** (en lugar de Docker local)
4. **Desplegar en:**
   - Railway
   - Render
   - DigitalOcean
   - AWS/GCP/Azure

### Frontend

1. **Compilar para producción:**
   ```bash
   npm run build
   ```
2. **Desplegar carpeta `dist/` en:**
   - Vercel
   - Netlify
   - Cloudflare Pages
   - AWS S3 + CloudFront

---

## 📚 Documentación Adicional

- **Backend:**
  - `BACK/API_DOCUMENTATION.md` - Documentación completa de API
  - `BACK/BUSINESS_INTELLIGENCE.md` - Guía de Analytics
  - `BACK/MULTIPLATFORM_GUIDE.md` - Soporte multi-plataforma
  - `BACK/CHANGELOG_BI.md` - Cambios en BI v2.0
  - `BACK/RESUMEN_EJECUTIVO_BI.md` - Resumen ejecutivo

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto es privado y confidencial.

---

## 🆘 Solución de Problemas

### MongoDB no se conecta

```bash
# Verificar que Docker está corriendo
docker ps

# Reiniciar contenedor
docker-compose restart

# Ver logs
docker-compose logs mongodb
```

### Backend no inicia

```bash
# Verificar que MongoDB está corriendo
# Verificar variables de entorno en .env
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Frontend no se conecta al Backend

1. Verificar que el backend está corriendo en `http://localhost:3000`
2. Verificar `WEB/.env` tiene `VITE_API_URL=http://localhost:3000`
3. Verificar CORS en `BACK/.env`

### Error de CORS

Agregar el origen del frontend en `BACK/.env`:
```env
CORS_ORIGINS=http://localhost:5173
```

---

## 📞 Soporte

Para más información o soporte, consultar la documentación en la carpeta `BACK/`.

---

**Desarrollado con ❤️ usando Clean Architecture y TypeScript**

**Versión:** 2.0.0  
**Fecha:** Marzo 2026
# Agendly
