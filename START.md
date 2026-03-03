# 🚀 Guía de Inicio Rápido - Agendly

## ⚡ Iniciar Todo el Sistema (3 pasos)

### 1️⃣ Levantar MongoDB

```bash
# En la raíz del proyecto
docker-compose up -d
```

✅ MongoDB corriendo en `localhost:27017`

---

### 2️⃣ Iniciar Backend

```bash
# Terminal 1
cd BACK
npm install          # Solo la primera vez
npm run db:seed      # Solo la primera vez (datos de prueba)
npm run dev
```

✅ Backend corriendo en `http://localhost:3000`

---

### 3️⃣ Iniciar Frontend

```bash
# Terminal 2 (nueva terminal)
cd WEB
npm install          # Solo la primera vez
npm run dev
```

✅ Frontend corriendo en `http://localhost:5173`

---

## 🎯 Acceder a la Aplicación

1. Abrir navegador: **http://localhost:5173**
2. Iniciar sesión con:
   - **Email:** `admin@test.com`
   - **Password:** `123456789`

---

## 📊 Explorar Funcionalidades

### Dashboard
- Ver KPIs en tiempo real
- Gráficas de rentabilidad
- Análisis de retención
- Puntualidad del staff

### Staff
- Lista de empleados
- Horarios de trabajo
- Ratings y reseñas

### Clientes
- Base de datos de clientes
- Búsqueda avanzada
- Fuentes de adquisición

### Marketing
- Código QR para imprimir
- Link de reserva rápida
- Deep links para apps móviles
- Descargar flyer PDF

---

## 🛑 Detener Todo

```bash
# Detener Backend: Ctrl+C en Terminal 1
# Detener Frontend: Ctrl+C en Terminal 2

# Detener MongoDB
docker-compose down
```

---

## 🔄 Reiniciar desde Cero

```bash
# Eliminar datos de MongoDB
docker-compose down -v

# Levantar MongoDB
docker-compose up -d

# Ejecutar seed nuevamente
cd BACK
npm run db:seed

# Iniciar backend y frontend
npm run dev  # en BACK/
npm run dev  # en WEB/
```

---

## 📝 Credenciales de Prueba

Después de ejecutar `npm run db:seed`:

| Rol | Email | Password |
|-----|-------|----------|
| Super Admin | superadmin@agendly.com | admin123 |
| Admin | admin@test.com | 123456789 |
| Staff | test@test.com | 123456789 |

---

## ✅ Verificar que Todo Funciona

### Backend
- Abrir: http://localhost:3000/api/health
- Debería mostrar: `{"success": true, "message": "Agendly API is running"}`

### Frontend
- Abrir: http://localhost:5173
- Debería mostrar la pantalla de login

### MongoDB
```bash
docker ps
```
Debería mostrar el contenedor `agendly-mongodb`

---

## 🆘 Problemas Comunes

### "Cannot connect to MongoDB"
```bash
docker-compose up -d
# Esperar 5 segundos y reintentar
```

### "Port 3000 already in use"
```bash
# Cambiar puerto en BACK/.env
PORT=3001
```

### "Port 5173 already in use"
```bash
# Vite asignará automáticamente otro puerto
# O detener el proceso que usa el puerto
```

### Frontend no se conecta al Backend
1. Verificar que BACK está corriendo
2. Verificar `WEB/.env`:
   ```
   VITE_API_URL=http://localhost:3000
   ```

---

## 📚 Más Información

- **README.md** - Guía completa
- **BACK/API_DOCUMENTATION.md** - Documentación de API
- **BACK/BUSINESS_INTELLIGENCE.md** - Guía de Analytics

---

¡Listo! 🎉 Tu sistema Agendly está corriendo.
