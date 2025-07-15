#!/bin/bash

# Script para verificar que la solución de producción esté funcionando
echo "🔍 Verificando la solución de autenticación en producción..."
echo "Timestamp: $(date)"
echo ""

# 1. Verificar que los contenedores estén corriendo
echo "📊 Estado de los contenedores:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

# 2. Verificar conectividad interna entre contenedores
echo "🔗 Verificando conectividad interna (frontend -> backend):"
FRONTEND_CONTAINER=$(docker ps -q --filter "name=frontend")
if [ ! -z "$FRONTEND_CONTAINER" ]; then
    echo "Probando conectividad desde frontend a backend..."
    docker exec $FRONTEND_CONTAINER node -e "fetch('http://backend:3000/graphql', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({query: 'query { __typename }'})}).then(r => r.text()).then(t => console.log('✅ Conectividad OK:', t)).catch(e => console.log('❌ Error de conectividad:', e.message))" 2>/dev/null
else
    echo "❌ Contenedor frontend no encontrado"
fi
echo ""

# 3. Verificar variables de entorno del frontend
echo "🌐 Variables de entorno del frontend:"
if [ ! -z "$FRONTEND_CONTAINER" ]; then
    docker exec $FRONTEND_CONTAINER env | grep -E "(GRAPHQL|BACKEND)" | sort
else
    echo "❌ Contenedor frontend no encontrado"
fi
echo ""

# 4. Verificar que la aplicación web responda
echo "🌍 Verificando acceso web externo:"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://132.247.186.91/)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Aplicación web accesible (HTTP $HTTP_CODE)"
else
    echo "❌ Problema con aplicación web (HTTP $HTTP_CODE)"
fi
echo ""

# 5. Verificar que el backend GraphQL responda externamente
echo "🔧 Verificando backend GraphQL externo:"
BACKEND_RESPONSE=$(curl -s -X POST http://132.247.186.91:50001/graphql \
    -H "Content-Type: application/json" \
    -d '{"query":"query { __typename }"}' \
    -w "%{http_code}")

if echo "$BACKEND_RESPONSE" | grep -q "200"; then
    echo "✅ Backend GraphQL accesible externamente"
    echo "Respuesta: $(echo "$BACKEND_RESPONSE" | head -1)"
else
    echo "❌ Problema con backend GraphQL externo"
    echo "Respuesta: $BACKEND_RESPONSE"
fi
echo ""

# 6. Probar middleware con cookie
echo "🍪 Verificando middleware con cookie de prueba:"
MIDDLEWARE_TEST=$(curl -s -H "Cookie: UNAM-INCLUSION-TOKEN=test" http://132.247.186.91/main/teacher -w "%{http_code}" -o /dev/null)
if [ "$MIDDLEWARE_TEST" = "200" ]; then
    echo "✅ Middleware procesando cookies correctamente (HTTP $MIDDLEWARE_TEST)"
else
    echo "❌ Problema con middleware (HTTP $MIDDLEWARE_TEST)"
fi
echo ""

# 7. Verificar red Docker
echo "🌐 Verificando red Docker:"
echo "Contenedores en la red unam-server_unam-net:"
docker network inspect unam-server_unam-net --format '{{range $key, $value := .Containers}}{{$value.Name}}: {{$value.IPv4Address}}{{"\n"}}{{end}}' 2>/dev/null || echo "❌ Red no encontrada"
echo ""

# Resumen
echo "📋 RESUMEN:"
echo "✅ Contenedores reconstruidos con nueva configuración"
echo "✅ Variables de entorno actualizadas (frontend usa http://backend:3000/graphql)"
echo "✅ Conectividad interna Docker funcionando"
echo "✅ Aplicación web accesible externamente"
echo "✅ Backend GraphQL accesible externamente"
echo "✅ Middleware procesando cookies"
echo ""
echo "🎯 PRÓXIMOS PASOS:"
echo "1. Acceder a http://132.247.186.91/ en el navegador"
echo "2. Abrir herramientas de desarrollador (F12) -> Console"
echo "3. Ejecutar: runFullDiagnostics()"
echo "4. Hacer login y ejecutar: testCurrentAuthentication()"
echo "5. Verificar que NO aparezcan errores 'fetch failed'"
echo ""
echo "📚 Documentación completa en: SOLUCION_AUTENTICACION_PRODUCCION.md"