# 🚀 Despliegue en Railway (Backend + MongoDB Atlas)

Esta guía te permite desplegar el backend en la nube para que la app Flutter funcione desde cualquier dispositivo sin depender de tu red local.

---

## 📋 Pre-requisitos

- Cuenta en [Railway](https://railway.app) (gratis)
- MongoDB Atlas configurado (ya lo tienes en `.env`)
- Proyecto en GitHub (recomendado) o despliegue manual

---

## 1️⃣ Crear proyecto en Railway

1. Entra a [railway.app](https://railway.app) y inicia sesión con GitHub.
2. **New Project** → **Deploy from GitHub repo** (o **Empty Project** si subes el código después).
3. Conecta tu repositorio y selecciona la carpeta `BACK` como raíz, o crea el proyecto en la raíz y ajusta el **Root Directory** a `BACK`.

---

## 2️⃣ Configurar variables de entorno

En Railway: **Variables** → **Add Variable** (o **Raw Editor** para pegar varias):

```env
# Base
NODE_ENV=production
PORT=3000

# MongoDB Atlas (copia de tu .env actual)
MONGODB_URI=mongodb+srv://Davis:1234567890@cluster0.sx9qodr.mongodb.net/agendlybd?retryWrites=true&w=majority&appName=Cluster0

# JWT (usa una clave fuerte en producción)
JWT_SEED=tu-clave-super-secreta-cambiar-en-produccion
JWT_EXPIRES_IN=2h

# Base URL - REEMPLAZA con la URL que te dé Railway después del deploy
# Ejemplo: https://tu-proyecto.up.railway.app
BASE_URL=https://TU-PROYECTO.up.railway.app

# CORS (permite la app móvil y web)
CORS_ORIGINS=https://TU-PROYECTO.up.railway.app,http://localhost:3000

# Firebase (opcional, para push)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Uploads (Railway usa sistema de archivos efímero - los uploads se pierden al reiniciar)
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

> ⚠️ **JWT_SEED**: Cambia `tu-clave-super-secreta-cambiar-en-produccion` por una cadena aleatoria larga.

---

## 3️⃣ Desplegar

1. Railway detecta Node.js y usará `npm run build` y `npm start`.
2. Pulsa **Deploy** o haz push a tu rama conectada.
3. Espera a que termine el build.
4. En **Settings** → **Networking** → **Generate Domain** para obtener la URL pública (ej: `https://agendly-backend-production-xxxx.up.railway.app`).
5. Actualiza `BASE_URL` y `CORS_ORIGINS` con esa URL y vuelve a desplegar.

---

## 4️⃣ Configurar la app Flutter

Actualiza `AGENDLY_APP/lib/config/constants/environment.dart` con la URL de Railway:

```dart
static String apiUrl = const String.fromEnvironment(
  'API_URL',
  defaultValue: 'https://TU-PROYECTO.up.railway.app/api',  // ← URL de Railway
);

static String socketUrl = const String.fromEnvironment(
  'SOCKET_URL',
  defaultValue: 'https://TU-PROYECTO.up.railway.app',
);
```

O compila con:

```bash
flutter run --dart-define=API_URL=https://tu-proyecto.up.railway.app/api --dart-define=SOCKET_URL=https://tu-proyecto.up.railway.app
```

---

## 5️⃣ Ejecutar seed en producción (opcional)

Si quieres datos de prueba en la BD de producción:

```bash
# En tu Mac, con las vars de producción
cd BACK
MONGODB_URI="mongodb+srv://Davis:...@cluster0....mongodb.net/agendlybd?..." npm run seed
```

O usa MongoDB Compass/Atlas para conectarte y verificar los datos.

---

## ✅ Verificar

- En el navegador: `https://TU-PROYECTO.up.railway.app/api/health`
- Debería devolver: `{"success":true,"message":"Agendly API is running",...}`

---

## 📌 Notas

- **MongoDB Atlas**: Ya está en la nube. El backend en Railway se conecta a Atlas sin cambios.
- **Uploads**: En Railway el disco es efímero. Para archivos persistentes usa un servicio externo (S3, Cloudinary, etc.).
- **WebSockets (Socket.IO)**: Railway los soporta. Verifica que la URL de socket en Flutter use `wss://` si usas HTTPS.
