# Solución para Problemas de Autenticación en Producción

## Problema Identificado

En producción aparecen errores repetidos:
```
❌ AuthDAL.hasAnyRole: No user or no roles
❌ AuthDAL.getHighestRole: No user or no roles
```

Y en los logs del contenedor se observa:
```
💥 getCurrentUser: Error occurred { error: 'fetch failed' }
🔍 getCurrentUser: Token check { hasToken: true, tokenLength: 187 }
🌐 getCurrentUser: Making GraphQL request { endpoint: 'http://132.247.186.91:50001/graphql' }
```

Esto indica que el usuario no se está detectando correctamente debido a problemas de conectividad entre el frontend y backend.

## Causas Principales

### 1. Problema de Red en Docker (CRÍTICO)
El frontend estaba intentando conectarse al backend usando la IP externa (`http://132.247.186.91:50001/graphql`) desde dentro del contenedor Docker, pero debería usar el nombre del servicio interno (`http://backend:3000/graphql`).

### 2. Configuración de Cookies
Problemas adicionales con la configuración de cookies en un servidor HTTP (sin SSL) en la dirección `http://132.247.186.91/`.

## Soluciones Implementadas

### 1. Corrección de Conectividad de Red (PRINCIPAL)

**Archivos modificados**:
- `docker-compose.yml`: Actualizado para usar nombres de servicio internos
- `.env.production`: Cambiado endpoint de GraphQL a `http://backend:3000/graphql`

**Antes (Problemático)**:
```yaml
environment:
  NEXT_PUBLIC_GRAPHQL_ENDPOINT: http://132.247.186.91:50001/graphql
```

**Después (Correcto)**:
```yaml
environment:
  NEXT_PUBLIC_GRAPHQL_ENDPOINT: http://backend:3000/graphql
```

### 2. Configuración de Cookies Optimizada

**Archivo modificado**: `app/utils/cookie-config.ts`
- ✅ Removido el `domain` específico para evitar problemas cross-domain
- ✅ Agregados logs de depuración
- ✅ Configuración optimizada para HTTP

**Archivo nuevo**: `app/utils/production-cookie-fix.ts`
- ✅ Configuración específica para producción HTTP
- ✅ Configuración de fallback para casos problemáticos
- ✅ Validación de configuración de cookies
- ✅ Logs de depuración detallados

### 3. Middleware Actualizado

**Archivo modificado**: `middleware.ts`
- ✅ Removido el `domain` específico
- ✅ Agregados logs de depuración
- ✅ Configuración optimizada para reconfigurar cookies

### 4. Logs de Depuración Mejorados

**Archivo modificado**: `app/actions/auth.ts`
- ✅ Logs detallados en `getCurrentUser()`
- ✅ Información de token, respuesta GraphQL y errores
- ✅ Logs en el proceso de logout

**Archivo modificado**: `app/actions/auth-actions.ts`
- ✅ Logs en el proceso de establecer cookies
- ✅ Uso de configuración optimizada

### 5. Herramientas de Diagnóstico

**Archivo nuevo**: `app/utils/auth-diagnostics.ts`
- ✅ Funciones de diagnóstico disponibles en la consola del navegador
- ✅ Verificación de cookies, localStorage, sessionStorage
- ✅ Pruebas de conectividad con el backend
- ✅ Pruebas de autenticación con el token actual

### 6. Script de Reparación Automática

**Archivo nuevo**: `fix-production-network.sh`
- ✅ Script para reconstruir y reiniciar contenedores
- ✅ Limpieza de imágenes para forzar rebuild
- ✅ Verificación automática del estado
- ✅ Comandos de monitoreo incluidos

## Cómo Aplicar la Solución

### Método 1: Script Automático (Recomendado)

```bash
# En el servidor de producción
cd ~/UNAM-Server
chmod +x fix-production-network.sh
./fix-production-network.sh
```

### Método 2: Manual

```bash
# En el servidor de producción
cd ~/UNAM-Server

# Detener contenedores
docker-compose down

# Limpiar imagen del frontend
docker rmi unam-server-frontend

# Reconstruir y levantar
docker-compose up -d --build

# Verificar estado
docker ps
docker logs $(docker ps -q --filter "name=frontend")
```

## Verificación de la Solución

### 1. Verificar Conectividad Interna
```bash
# Probar conectividad desde el contenedor frontend al backend
docker exec -it $(docker ps -q --filter "name=frontend") curl http://backend:3000/graphql -X POST -H "Content-Type: application/json" -d '{"query":"query { __typename }"}'
```

### 2. Verificar en el Navegador
1. Abrir `http://132.247.186.91/` en el navegador
2. Abrir las herramientas de desarrollador (F12)
3. Ir a la pestaña "Console"
4. Ejecutar: `runFullDiagnostics()`
5. Revisar los logs para identificar problemas

### 3. Verificar el Login
1. Hacer login en la aplicación
2. En la consola, ejecutar: `testCurrentAuthentication()`
3. Verificar que se muestre: "✅ Usuario autenticado"
4. Verificar que los roles se muestren correctamente

### 4. Monitorear los Logs
En la consola del navegador deberías ver logs como:
```
🍪 Cookie config: { environment: 'production', config: {...} }
🔍 getCurrentUser: Token check: { hasToken: true, tokenLength: 187 }
🌐 getCurrentUser: Making GraphQL request: { endpoint: 'http://backend:3000/graphql' }
✅ getCurrentUser: User validated successfully: { userId: '...', roles: [...] }
```

**YA NO deberías ver**:
```
💥 getCurrentUser: Error occurred { error: 'fetch failed' }
```

## Herramientas de Diagnóstico

### En la Consola del Navegador (F12)

```javascript
// Ejecutar diagnóstico completo
runFullDiagnostics()

// Solo verificar estado de autenticación
runAuthDiagnostics()

// Solo probar conectividad con backend
testBackendConnectivity()

// Solo probar autenticación actual
testCurrentAuthentication()
```

### Comandos de Monitoreo

```bash
# Monitorear logs en tiempo real
docker-compose logs -f frontend
docker-compose logs -f backend

# Ver estado de contenedores
docker ps

# Ver logs específicos
docker logs $(docker ps -q --filter "name=frontend") --tail 50
docker logs $(docker ps -q --filter "name=backend") --tail 50
```

## Configuración de Red Actualizada

### Docker Compose - Antes (Problemático)
```yaml
frontend:
  environment:
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: http://132.247.186.91:50001/graphql
```

### Docker Compose - Después (Correcto)
```yaml
frontend:
  build:
    args:
      # Para build time, usar URLs externas
      NEXT_PUBLIC_GRAPHQL_ENDPOINT: http://132.247.186.91:50001/graphql
  environment:
    # Para runtime, usar nombres de servicio internos
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: http://backend:3000/graphql
```

## Solución de Problemas Adicionales

### Si el problema persiste:

1. **Verificar que los contenedores estén en la misma red**:
   ```bash
   docker network ls
   docker network inspect unam-server_unam-net
   ```

2. **Verificar variables de entorno del contenedor**:
   ```bash
   docker exec $(docker ps -q --filter "name=frontend") env | grep GRAPHQL
   ```

3. **Probar conectividad manual**:
   ```bash
   docker exec -it $(docker ps -q --filter "name=frontend") ping backend
   ```

4. **Verificar que el backend esté respondiendo**:
   ```bash
   curl -X POST http://132.247.186.91:50001/graphql \
     -H "Content-Type: application/json" \
     -d '{"query":"query { __typename }"}'
   ```

5. **Reconstruir completamente**:
   ```bash
   docker-compose down -v
   docker system prune -f
   docker-compose up -d --build
   ```

## Notas Importantes

- ✅ **Red Docker**: Los contenedores ahora usan la red interna de Docker correctamente
- ✅ **Compatibilidad**: La solución mantiene las URLs externas para acceso desde fuera de Docker
- ✅ **Monitoreo**: Logs detallados para diagnosticar problemas futuros
- ⚠️ **Seguridad**: Los logs contienen información sensible. En producción final, reducir el nivel de logging
- ⚠️ **Performance**: Los logs adicionales pueden afectar el rendimiento. Considerar deshabilitarlos después de resolver el problema

## Resumen de la Solución

El problema principal era de **conectividad de red en Docker**. El frontend intentaba conectarse al backend usando la IP externa desde dentro del contenedor, lo que causaba errores de "fetch failed". La solución fue:

1. **Configurar el frontend para usar el nombre del servicio interno** (`backend:3000`) para comunicación interna
2. **Mantener las URLs externas** (`132.247.186.91:50001`) para acceso desde fuera de Docker
3. **Optimizar la configuración de cookies** para servidores HTTP sin SSL
4. **Agregar herramientas de diagnóstico** para monitoreo continuo

Con estos cambios, la autenticación debería funcionar correctamente y los errores de "No user or no roles" deberían desaparecer.