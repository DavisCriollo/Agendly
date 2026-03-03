# 🌐 Agendly Web - Panel de Administración

Panel web de administración para Agendly, construido con React, Vite, TypeScript y Tailwind CSS.

---

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Iniciar en modo desarrollo
npm run dev
```

La aplicación estará disponible en **http://localhost:5173**

---

## 📦 Tecnologías

- **React 18** - Librería UI
- **Vite** - Build tool ultrarrápido
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilos utility-first
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **Recharts** - Gráficas y visualizaciones
- **Lucide React** - Iconos
- **date-fns** - Manejo de fechas

---

## 📁 Estructura del Proyecto

```
src/
├── pages/              # Páginas principales
│   ├── Login.tsx       # Autenticación
│   ├── Dashboard.tsx   # Dashboard principal
│   ├── Staff.tsx       # Gestión de staff
│   ├── Clients.tsx     # Gestión de clientes
│   └── Marketing.tsx   # Marketing y QR
├── components/         # Componentes reutilizables
│   └── Layout.tsx      # Layout principal con sidebar
├── services/           # Servicios API
│   └── api.ts          # Configuración de Axios y servicios
├── App.tsx            # Componente principal
├── main.tsx           # Punto de entrada
└── index.css          # Estilos globales
```

---

## 🎨 Páginas Implementadas

### 1. Login (`/login`)
- Autenticación con email y password
- Validación de credenciales
- Redirección automática al dashboard

### 2. Dashboard (`/`)
- KPIs principales (Utilidad, Retención, Puntualidad, Clientes)
- Gráfica de rentabilidad por servicio
- Gráfica de clientes nuevos vs recurrentes
- Ranking de puntualidad del staff
- Fuentes de adquisición de clientes
- Filtros por rango de fechas

### 3. Staff (`/staff`)
- Lista de empleados con cards
- Información de horarios de trabajo
- Ratings y reseñas
- Servicios asignados
- Estado activo/inactivo

### 4. Clientes (`/clients`)
- Tabla de clientes con búsqueda
- Filtros por nombre, email, teléfono
- Información de contacto
- Fuente de adquisición
- Fecha de registro
- Estado activo/inactivo

### 5. Marketing (`/marketing`)
- Visualización de código QR
- Link de reserva rápida
- Deep links para iOS y Android
- Descarga de flyer PDF
- Instrucciones de uso

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Compila para producción
npm run preview      # Previsualiza build de producción

# Calidad de código
npm run lint         # Ejecuta ESLint
```

---

## 🌐 Variables de Entorno

Crear archivo `.env` en la raíz del proyecto WEB:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Agendly
```

**Importante:** Las variables deben empezar con `VITE_` para ser accesibles en el código.

---

## 🎯 Servicios API

Todos los servicios están centralizados en `src/services/api.ts`:

### Autenticación
```typescript
authService.login(email, password)
authService.logout()
authService.getCurrentUser()
```

### Analytics
```typescript
analyticsService.getDashboard(businessId, startDate, endDate)
analyticsService.getProfitability(businessId, startDate, endDate)
analyticsService.getEfficiency(businessId, startDate, endDate)
analyticsService.getRetention(businessId)
analyticsService.getHeatMap(businessId, startDate, endDate)
```

### Staff
```typescript
staffService.getAll(businessId)
staffService.getById(businessId, staffId)
staffService.create(businessId, data)
staffService.update(businessId, staffId, data)
```

### Clientes
```typescript
clientService.getAll(businessId)
clientService.getById(businessId, clientId)
clientService.create(businessId, data)
```

### Marketing
```typescript
marketingService.getWelcomeKit(businessId)
marketingService.downloadFlyer(businessId)
```

---

## 🎨 Componentes de UI

### Layout
Sidebar fijo con navegación principal:
- Dashboard
- Staff
- Clientes
- Marketing
- Perfil de usuario
- Logout

### Cards
Componente reutilizable con clase `.card`:
```tsx
<div className="card">
  <h3>Título</h3>
  <p>Contenido</p>
</div>
```

### Botones
```tsx
<button className="btn-primary">Primario</button>
<button className="btn-secondary">Secundario</button>
```

### Inputs
```tsx
<input className="input" type="text" placeholder="..." />
```

---

## 📊 Gráficas con Recharts

### Gráfica de Barras
```tsx
<BarChart data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="value" fill="#0ea5e9" />
</BarChart>
```

### Gráfica de Pastel
```tsx
<PieChart>
  <Pie
    data={data}
    dataKey="value"
    nameKey="name"
    cx="50%"
    cy="50%"
    outerRadius={100}
  />
  <Tooltip />
</PieChart>
```

---

## 🔐 Autenticación

El sistema usa JWT almacenado en `localStorage`:

```typescript
// Login
const response = await authService.login(email, password);
// Token guardado automáticamente en localStorage

// Logout
authService.logout();
// Token eliminado de localStorage

// Obtener usuario actual
const user = authService.getCurrentUser();
```

Los interceptores de Axios agregan automáticamente el token a todas las peticiones.

---

## 🎨 Personalización de Estilos

### Colores Principales
Definidos en `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#f0f9ff',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
  }
}
```

### Clases Personalizadas
Definidas en `src/index.css`:

- `.card` - Tarjeta con sombra
- `.btn-primary` - Botón primario
- `.btn-secondary` - Botón secundario
- `.input` - Input estilizado

---

## 📱 Responsive Design

Todas las páginas son responsive usando Tailwind:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Contenido */}
</div>
```

- **Mobile**: 1 columna
- **Tablet (md)**: 2 columnas
- **Desktop (lg)**: 4 columnas

---

## 🚀 Despliegue

### Build para Producción

```bash
npm run build
```

Esto genera una carpeta `dist/` optimizada.

### Desplegar en Vercel

```bash
npm install -g vercel
vercel
```

### Desplegar en Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## 🐛 Debugging

### React DevTools
Instalar extensión de navegador: [React DevTools](https://react.dev/learn/react-developer-tools)

### Logs de API
Todos los errores de API se muestran en la consola del navegador.

### Hot Module Replacement (HMR)
Vite recarga automáticamente los cambios sin perder el estado.

---

## 📚 Recursos

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [React Router](https://reactrouter.com/)

---

## 🤝 Contribuir

1. Crear rama feature
2. Hacer cambios
3. Ejecutar `npm run lint`
4. Crear pull request

---

**Desarrollado con React + Vite + TypeScript + Tailwind CSS** ⚡
