# 🚀 Guía de Despliegue - Agendly Backend

## 📋 Pre-requisitos

- Node.js 18+
- MongoDB Atlas (o MongoDB local)
- Cuenta Firebase (para FCM)
- Servidor con PM2 o Docker

---

## 🔧 Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env` en producción:

```env
# Server
PORT=3000
NODE_ENV=production

# MongoDB Atlas
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/agendly?retryWrites=true&w=majority

# JWT
JWT_SEED=tu-clave-secreta-super-segura-cambiar-en-produccion
JWT_EXPIRES_IN=7d

# Firebase (FCM)
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@tu-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu-private-key-aqui\n-----END PRIVATE KEY-----\n"

# Uploads
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Base URL
BASE_URL=https://tudominio.com
```

### 2. Instalación de Dependencias

```bash
npm install --production
```

---

## 🏗️ Opción 1: Despliegue con PM2

### Instalación de PM2

```bash
npm install -g pm2
```

### Compilar TypeScript

```bash
npm run build
```

### Iniciar con PM2

```bash
pm2 start dist/presentation/server.js --name agendly-backend
```

### Configuración PM2 Avanzada

Crea `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'agendly-backend',
    script: './dist/presentation/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

Iniciar:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Comandos PM2 Útiles

```bash
# Ver logs
pm2 logs agendly-backend

# Monitorear
pm2 monit

# Reiniciar
pm2 restart agendly-backend

# Detener
pm2 stop agendly-backend

# Eliminar
pm2 delete agendly-backend
```

---

## 🐳 Opción 2: Despliegue con Docker

### Dockerfile

Crea `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/presentation/server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SEED=${JWT_SEED}
      - FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
      - FIREBASE_CLIENT_EMAIL=${FIREBASE_CLIENT_EMAIL}
      - FIREBASE_PRIVATE_KEY=${FIREBASE_PRIVATE_KEY}
    volumes:
      - ./uploads:/app/uploads
    restart: unless-stopped
    networks:
      - agendly-network

networks:
  agendly-network:
    driver: bridge
```

### Construir y Ejecutar

```bash
# Construir imagen
docker build -t agendly-backend .

# Ejecutar contenedor
docker run -d \
  --name agendly-backend \
  -p 3000:3000 \
  --env-file .env \
  agendly-backend

# Con docker-compose
docker-compose up -d
```

---

## ☁️ Opción 3: Despliegue en la Nube

### AWS EC2

1. **Lanzar instancia EC2** (Ubuntu 22.04)
2. **Instalar Node.js y PM2**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```
3. **Clonar repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/agendly-backend.git
   cd agendly-backend/BACK
   ```
4. **Configurar .env**
5. **Instalar y ejecutar**:
   ```bash
   npm install
   npm run build
   pm2 start ecosystem.config.js
   ```

### Heroku

1. **Crear Procfile**:
   ```
   web: node dist/presentation/server.js
   ```

2. **Desplegar**:
   ```bash
   heroku create agendly-backend
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=tu-uri
   heroku config:set JWT_SEED=tu-seed
   git push heroku main
   ```

### Railway

1. **Conectar repositorio GitHub**
2. **Configurar variables de entorno** en el dashboard
3. **Deploy automático** en cada push

### Render

1. **Crear Web Service**
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `node dist/presentation/server.js`
4. **Configurar variables de entorno**

---

## 🗄️ MongoDB Atlas

### Configuración

1. **Crear cluster** en MongoDB Atlas
2. **Whitelist IP** (0.0.0.0/0 para desarrollo, IPs específicas en producción)
3. **Crear usuario** con permisos de lectura/escritura
4. **Obtener connection string**:
   ```
   mongodb+srv://usuario:password@cluster.mongodb.net/agendly
   ```

### Índices

Los índices se crean automáticamente al iniciar la aplicación. Para verificar:

```javascript
db.appointments.getIndexes()
db.staff.getIndexes()
db.clients.getIndexes()
db.reviews.getIndexes()
```

---

## 🔥 Firebase Cloud Messaging

### Configuración

1. **Ir a Firebase Console** → Configuración del proyecto
2. **Cuentas de servicio** → Generar nueva clave privada
3. **Descargar JSON** con credenciales
4. **Extraer valores**:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

---

## 🔒 Nginx (Reverse Proxy)

### Instalación

```bash
sudo apt update
sudo apt install nginx
```

### Configuración

Crea `/etc/nginx/sites-available/agendly`:

```nginx
server {
    listen 80;
    server_name tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSockets
    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Activar:

```bash
sudo ln -s /etc/nginx/sites-available/agendly /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔐 SSL con Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tudominio.com
```

Renovación automática:

```bash
sudo certbot renew --dry-run
```

---

## 📊 Monitoreo

### PM2 Monitoring

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Logs

```bash
# Ver logs en tiempo real
pm2 logs agendly-backend

# Logs de error
pm2 logs agendly-backend --err

# Logs de salida
pm2 logs agendly-backend --out
```

---

## 🔄 Actualización

### Con PM2

```bash
git pull origin main
npm install
npm run build
pm2 restart agendly-backend
```

### Con Docker

```bash
git pull origin main
docker-compose down
docker-compose build
docker-compose up -d
```

---

## 🧪 Verificación Post-Despliegue

### Health Check

```bash
curl https://tudominio.com/api/health
```

Respuesta esperada:

```json
{
  "ok": true,
  "message": "Agendly API is running"
}
```

### Test de Endpoints

```bash
# Login
curl -X POST https://tudominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"123456789"}'

# Obtener servicios
curl https://tudominio.com/api/services \
  -H "Authorization: Bearer TOKEN_AQUI"
```

---

## 🔧 Troubleshooting

### Error: Cannot connect to MongoDB

```bash
# Verificar connection string
echo $MONGODB_URI

# Verificar whitelist de IPs en MongoDB Atlas
# Verificar usuario y contraseña
```

### Error: Port 3000 already in use

```bash
# Ver qué proceso usa el puerto
sudo lsof -i :3000

# Matar proceso
sudo kill -9 PID
```

### Error: Firebase credentials invalid

```bash
# Verificar formato de FIREBASE_PRIVATE_KEY
# Debe incluir \n para saltos de línea
echo $FIREBASE_PRIVATE_KEY
```

---

## 📈 Optimizaciones de Producción

### 1. Compresión

Instalar:

```bash
npm install compression
```

Agregar en `server.ts`:

```typescript
import compression from 'compression';
app.use(compression());
```

### 2. Rate Limiting

```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);
```

### 3. Helmet (Seguridad)

```bash
npm install helmet
```

```typescript
import helmet from 'helmet';
app.use(helmet());
```

---

## 🎯 Checklist de Despliegue

- [ ] Variables de entorno configuradas
- [ ] MongoDB Atlas conectado
- [ ] Firebase FCM configurado
- [ ] Aplicación compilada (`npm run build`)
- [ ] PM2 o Docker configurado
- [ ] Nginx como reverse proxy
- [ ] SSL con Let's Encrypt
- [ ] Logs configurados
- [ ] Monitoreo activo
- [ ] Health check funcionando
- [ ] Seed de datos ejecutado (opcional)
- [ ] Backup de base de datos configurado

---

## 📞 Soporte

Para problemas de despliegue:
1. Revisar logs: `pm2 logs` o `docker logs`
2. Verificar variables de entorno
3. Comprobar conexión a MongoDB
4. Verificar puertos abiertos

---

**¡Backend listo para producción!** 🚀
