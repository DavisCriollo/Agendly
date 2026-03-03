#!/bin/bash

# 🚀 Agendly - Comandos Rápidos
# Este script contiene todos los comandos necesarios para iniciar el ecosistema

echo "🚀 Agendly - Ecosistema Completo"
echo "================================"
echo ""

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar requisitos
echo "📋 Verificando requisitos..."

if ! command_exists docker; then
    echo "❌ Docker no está instalado. Por favor instala Docker Desktop."
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+."
    exit 1
fi

echo "✅ Docker instalado"
echo "✅ Node.js instalado"
echo ""

# Menú principal
echo "Selecciona una opción:"
echo "1) 🚀 Iniciar todo el sistema (Primera vez)"
echo "2) ▶️  Iniciar sistema (Ya configurado)"
echo "3) 🛑 Detener todo"
echo "4) 🔄 Reiniciar desde cero"
echo "5) 📊 Ver estado"
echo "6) ❌ Salir"
echo ""
read -p "Opción: " option

case $option in
    1)
        echo ""
        echo "🚀 Iniciando sistema por primera vez..."
        echo ""
        
        # Levantar MongoDB
        echo "1️⃣ Levantando MongoDB..."
        docker-compose up -d
        echo "✅ MongoDB corriendo en localhost:27017"
        echo ""
        
        # Backend
        echo "2️⃣ Configurando Backend..."
        cd BACK
        
        if [ ! -d "node_modules" ]; then
            echo "   Instalando dependencias..."
            npm install
        fi
        
        if [ ! -f ".env" ]; then
            echo "   Creando archivo .env..."
            cp .env.example .env
        fi
        
        echo "   Ejecutando seed de datos..."
        npm run db:seed
        
        echo "   Iniciando servidor backend..."
        echo "   ⚠️  Abre una nueva terminal y ejecuta: cd BACK && npm run dev"
        echo ""
        
        # Frontend
        echo "3️⃣ Configurando Frontend..."
        cd ../WEB
        
        if [ ! -d "node_modules" ]; then
            echo "   Instalando dependencias..."
            npm install
        fi
        
        if [ ! -f ".env" ]; then
            echo "   Creando archivo .env..."
            cp .env.example .env
        fi
        
        echo "   ⚠️  Abre otra terminal y ejecuta: cd WEB && npm run dev"
        echo ""
        
        echo "✅ Sistema configurado!"
        echo ""
        echo "📝 Próximos pasos:"
        echo "   1. Abre terminal y ejecuta: cd BACK && npm run dev"
        echo "   2. Abre otra terminal y ejecuta: cd WEB && npm run dev"
        echo "   3. Abre navegador en: http://localhost:5173"
        echo "   4. Login: admin@test.com / 123456789"
        ;;
        
    2)
        echo ""
        echo "▶️  Iniciando sistema..."
        echo ""
        
        # Verificar MongoDB
        if ! docker ps | grep -q agendly-mongodb; then
            echo "   Levantando MongoDB..."
            docker-compose up -d
        else
            echo "   ✅ MongoDB ya está corriendo"
        fi
        
        echo ""
        echo "📝 Ejecuta en terminales separadas:"
        echo "   Terminal 1: cd BACK && npm run dev"
        echo "   Terminal 2: cd WEB && npm run dev"
        ;;
        
    3)
        echo ""
        echo "🛑 Deteniendo sistema..."
        docker-compose down
        echo "✅ MongoDB detenido"
        echo "⚠️  Detén Backend y Frontend con Ctrl+C en sus terminales"
        ;;
        
    4)
        echo ""
        echo "🔄 Reiniciando desde cero..."
        echo "⚠️  ADVERTENCIA: Esto eliminará todos los datos!"
        read -p "¿Estás seguro? (s/n): " confirm
        
        if [ "$confirm" = "s" ]; then
            docker-compose down -v
            docker-compose up -d
            cd BACK
            npm run db:seed
            echo "✅ Sistema reiniciado"
            echo "   Ejecuta: cd BACK && npm run dev"
            echo "   Ejecuta: cd WEB && npm run dev"
        else
            echo "❌ Operación cancelada"
        fi
        ;;
        
    5)
        echo ""
        echo "📊 Estado del sistema:"
        echo ""
        
        # MongoDB
        if docker ps | grep -q agendly-mongodb; then
            echo "✅ MongoDB: Corriendo"
        else
            echo "❌ MongoDB: Detenido"
        fi
        
        # Backend
        if lsof -i:3000 >/dev/null 2>&1; then
            echo "✅ Backend: Corriendo en puerto 3000"
        else
            echo "❌ Backend: No está corriendo"
        fi
        
        # Frontend
        if lsof -i:5173 >/dev/null 2>&1; then
            echo "✅ Frontend: Corriendo en puerto 5173"
        else
            echo "❌ Frontend: No está corriendo"
        fi
        ;;
        
    6)
        echo "👋 ¡Hasta luego!"
        exit 0
        ;;
        
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

echo ""
echo "================================"
echo "📚 Documentación:"
echo "   - README.md - Guía completa"
echo "   - START.md - Inicio rápido"
echo "   - ECOSISTEMA_COMPLETO.md - Visión general"
echo ""
