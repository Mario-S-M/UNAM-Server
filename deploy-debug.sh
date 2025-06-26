#!/bin/bash

# Script de despliegue para el servidor de producción 132.247.186.91
# Resuelve problemas de cookies con debugging extendido

echo "🚀 Iniciando despliegue de UNAM Escuela..."

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: No se encuentra docker-compose.yml"
    echo "Ejecuta este script desde el directorio raíz del proyecto"
    exit 1
fi

# Parar contenedores existentes
echo "🛑 Deteniendo contenedores existentes..."
docker-compose down

# Limpiar imágenes y volúmenes huérfanos
echo "🧹 Limpiando recursos no utilizados..."
docker system prune -f
docker volume prune -f

# Construir e iniciar con logs
echo "🔨 Construyendo y iniciando contenedores..."
docker-compose up --build -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 30

# Verificar el estado de los contenedores
echo "📊 Estado de los contenedores:"
docker-compose ps

# Verificar logs del backend para debugging
echo "📋 Logs del backend (últimas 20 líneas):"
docker-compose logs --tail=20 backend

# Verificar logs del frontend para debugging
echo "📋 Logs del frontend (últimas 20 líneas):"
docker-compose logs --tail=20 frontend

# Mostrar información de conectividad
echo "🌐 Información de conectividad:"
echo "Frontend: http://132.247.186.91 (puerto 80)"
echo "Backend: http://132.247.186.91:50001"
echo "GraphQL: http://132.247.186.91:50001/graphql"
echo "Base de datos: puerto 5432"
echo "PgAdmin: http://132.247.186.91:5050"

# Verificar si los puertos están escuchando
echo "🔍 Verificando puertos..."
netstat -tulpn | grep -E ":(80|50001|5432|5050)" || echo "⚠️ Algunos puertos podrían no estar disponibles"

echo "✅ Despliegue completado!"
echo "💡 Para monitorear logs en tiempo real:"
echo "   docker-compose logs -f backend"
echo "   docker-compose logs -f frontend"
echo ""
echo "🐞 Para debugging de cookies, revisa los logs del frontend"
echo "   Los logs mostrarán información detallada sobre la configuración de cookies"
