#!/bin/bash

# Script para solucionar el problema de conectividad en producción
# Ejecutar desde el directorio raíz del proyecto: ~/UNAM-Server

echo "🔧 Solucionando problema de conectividad en producción..."
echo "Timestamp: $(date)"

# Detener todos los contenedores
echo "⏹️ Deteniendo contenedores..."
docker-compose down

# Limpiar imágenes del frontend para forzar rebuild
echo "🧹 Limpiando imagen del frontend..."
docker rmi unam-server-frontend 2>/dev/null || echo "Imagen del frontend no encontrada, continuando..."

# Reconstruir y levantar los servicios
echo "🏗️ Reconstruyendo y levantando servicios..."
docker-compose up -d --build

# Esperar un momento para que los servicios se inicien
echo "⏳ Esperando que los servicios se inicien..."
sleep 10

# Verificar el estado de los contenedores
echo "📊 Estado de los contenedores:"
docker ps

echo ""
echo "🔍 Logs del frontend (últimas 20 líneas):"
docker logs --tail 20 $(docker ps -q --filter "name=frontend")

echo ""
echo "🔍 Logs del backend (últimas 10 líneas):"
docker logs --tail 10 $(docker ps -q --filter "name=backend")

echo ""
echo "✅ Proceso completado!"
echo "🌐 La aplicación debería estar disponible en: http://132.247.186.91/"
echo "🔧 Backend API disponible en: http://132.247.186.91:50001/graphql"
echo ""
echo "📝 Para monitorear los logs en tiempo real:"
echo "   docker-compose logs -f frontend"
echo "   docker-compose logs -f backend"
echo ""
echo "🛠️ Para verificar la conectividad interna:"
echo "   docker exec -it \$(docker ps -q --filter \"name=frontend\") curl http://backend:3000/graphql -X POST -H \"Content-Type: application/json\" -d '{\"query\":\"query { __typename }\"}'"