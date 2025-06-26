#!/bin/bash

# Script para reconstruir y desplegar rápidamente el proyecto

echo "🚀 Iniciando rebuild y deploy..."

# Detener contenedores actuales
echo "⏹️ Deteniendo contenedores..."
docker-compose down

# Limpiar imágenes antiguas para forzar rebuild
echo "🗑️ Limpiando imágenes antiguas..."
docker image prune -f
docker rmi unam-server-frontend:latest 2>/dev/null || true
docker rmi unam-server-backend:latest 2>/dev/null || true

# Rebuild y levantar servicios
echo "🔨 Reconstruyendo contenedores..."
docker-compose up --build -d

# Mostrar logs de frontend por unos segundos para verificar
echo "📋 Mostrando logs del frontend (presiona Ctrl+C para salir)..."
sleep 2
docker-compose logs -f frontend
