# Solución al Problema de Cookies en Producción

## Problema Identificado

Cuando se desplegaba la aplicación en producción, el login mostraba "sesión iniciada correctamente" pero las cookies no se establecían correctamente, causando que el usuario no permaneciera autenticado.

## Causa Raíz

El problema estaba en la configuración de cookies en el archivo `/unam-frontend/lib/cookies.ts`:

### Configuración Anterior (Problemática)
```javascript
document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Strict; Secure=${window.location.protocol === 'https:'}`;
```

### Problemas Identificados:

1. **Secure Flag Dinámico**: La configuración `Secure=${window.location.protocol === 'https:'}` generaba `Secure=false` en producción HTTP, lo cual es una sintaxis inválida para cookies.

2. **SameSite=Strict**: Esta configuración es muy restrictiva y puede causar problemas en algunos navegadores y configuraciones de red.

3. **Entorno de Producción HTTP**: El servidor de producción corre en HTTP (puerto 80), no HTTPS, por lo que el flag `Secure` no debe estar presente.

## Solución Implementada

### Nueva Configuración de setCookie
```javascript
export function setCookie(name: string, value: string, days: number = 7): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  
  // En producción con HTTP, no usar Secure flag
  const isSecure = window.location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';
  
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${secureFlag}`;
}
```

### Nueva Configuración de removeCookie
```javascript
export function removeCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}
```

### Cambios Realizados:

1. **Secure Flag Condicional**: Solo se agrega el flag `Secure` cuando realmente se está usando HTTPS.
2. **SameSite=Lax**: Cambiado de `Strict` a `Lax` para mejor compatibilidad.
3. **Sintaxis Correcta**: Eliminada la sintaxis inválida `Secure=false`.

## Configuración del Entorno

### Producción
- **Frontend**: Puerto 80 (HTTP)
- **Backend**: Puerto 50001 (HTTP)
- **Base de Datos**: Puerto 5432
- **Protocolo**: HTTP (sin SSL/TLS)

### Desarrollo
- **Frontend**: Puerto 3001 (HTTP)
- **Backend**: Puerto 3000 (HTTP)
- **Base de Datos**: Puerto 5432
- **Protocolo**: HTTP (sin SSL/TLS)

## Verificación de CORS

El backend ya tenía la configuración correcta de CORS en `/UNAM-escuela-backend/src/main.ts`:

```javascript
app.enableCors({
  origin: [
    'http://localhost',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://132.247.186.91',
    'http://132.247.186.91:80',
    // ... otros orígenes
  ],
  credentials: true, // ✅ Importante para cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Apollo-Require-Preflight',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  optionsSuccessStatus: 200,
});
```

## Resultado Esperado

Con estos cambios, las cookies de autenticación deberían establecerse correctamente en producción, permitiendo que:

1. El token de autenticación se guarde en las cookies del navegador
2. Las solicitudes subsecuentes incluyan automáticamente el token
3. El usuario permanezca autenticado entre sesiones
4. La navegación entre páginas mantenga el estado de autenticación

## Pruebas Recomendadas

1. **Login en Producción**: Verificar que después del login exitoso, las cookies se establezcan en el navegador.
2. **Persistencia**: Refrescar la página y verificar que el usuario siga autenticado.
3. **Navegación**: Navegar entre diferentes páginas y verificar que se mantenga la autenticación.
4. **Logout**: Verificar que las cookies se eliminen correctamente al cerrar sesión.

## Archivos Modificados

- `/unam-frontend/lib/cookies.ts` - Funciones `setCookie` y `removeCookie`

## Notas Adicionales

- No se requieren cambios en el backend
- No se requieren cambios en la configuración de Docker
- Los cambios son compatibles tanto con desarrollo como con producción
- Si en el futuro se implementa HTTPS, las cookies funcionarán automáticamente con el flag `Secure`