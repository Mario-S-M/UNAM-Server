// filepath: /Users/mac/Documents/UNAM-Server/UNAM-escuela-frontend/README-DAL.md

# Sistema DAL (Data Access Layer) para Autenticación y Autorización

## 🎯 ¿Qué se implementó?

Se creó un sistema robusto de **Data Access Layer (DAL)** que centraliza toda la lógica de autenticación y autorización, eliminando la duplicación de código y mejorando la seguridad.

## 📁 Estructura de archivos creados/modificados:

### 1. **DAL Principal**

- `app/dal/auth-dal.ts` - Clase principal que maneja toda la lógica de roles y permisos

### 2. **Hooks de autorización**

- `app/hooks/use-authorization.ts` - Hooks personalizados que usan el DAL
- `app/hooks/use-smart-redirect.ts` - Hook para redirecciones inteligentes

### 3. **Componentes de protección**

- `components/auth/route-guard.tsx` - Componente para proteger rutas
- `components/auth/role-based-navigation.tsx` - Navegación basada en roles

### 4. **Páginas actualizadas**

- `app/main/admin-debug/page.tsx` - Panel de debug (solo superUser/admin)
- `app/main/admin/page.tsx` - Panel de administración
- `app/main/teacher/page.tsx` - Panel de maestros
- `app/main/student/page.tsx` - Panel de estudiantes

### 5. **Mejoras en la UI**

- `components/layout/header.tsx` - Se quitó el icono de casa como solicitaste
- `app/actions/auth-actions.ts` - Redirección inteligente después del login

## 🛡️ Características del sistema:

### **1. Jerarquía de roles definida:**

```typescript
superUser (nivel 5) - Acceso completo + debug
admin (nivel 4) - Gestión de usuarios y contenido
docente (nivel 3) - Creación y gestión de contenido
alumno (nivel 2) - Acceso a contenido educativo
mortal (nivel 1) - Acceso básico
```

### **2. Permisos granulares:**

- `admin` - Acceso a funciones administrativas
- `teacher` - Funciones de enseñanza
- `student` - Funciones de aprendizaje
- `content_management` - Gestión de contenido
- `user_management` - Gestión de usuarios
- `debug` - Acceso a herramientas de debugging

### **3. Redirección inteligente:**

- **superUser** → `/main/admin-debug`
- **admin** → `/main/admin`
- **docente** → `/main/teacher`
- **alumno** → `/main/student`
- **Sin roles** → `/main`

## 🔧 Cómo usar el sistema:

### **Proteger una página completa:**

```tsx
import { RouteGuard } from "@/components/auth/route-guard";

export default function MiPagina() {
  return (
    <RouteGuard requiredPage="/main/mi-pagina">
      <MiContenido />
    </RouteGuard>
  );
}
```

### **Verificar permisos en componentes:**

```tsx
import { usePermissions } from "@/app/hooks/use-authorization";

function MiComponente() {
  const { canManageUsers, canTeach, userRole } = usePermissions();

  return (
    <div>
      {canManageUsers && <BotonGestionarUsuarios />}
      {canTeach && <PanelMaestro />}
      <p>Tu rol: {userRole}</p>
    </div>
  );
}
```

### **Usar el hook de autorización completo:**

```tsx
import { useAuthorization } from "@/app/hooks/use-authorization";

function MiComponente() {
  const { user, hasPermission, canPerformOperation, redirectToMainPage } =
    useAuthorization();

  if (!hasPermission("admin")) {
    redirectToMainPage();
    return null;
  }

  return <PanelAdmin />;
}
```

## 🎨 Componentes de navegación:

### **Navegación basada en roles:**

```tsx
import { RoleBasedNavigation } from "@/components/auth/role-based-navigation";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <RoleBasedNavigation />
    </div>
  );
}
```

## ✅ Ventajas del sistema DAL:

1. **Centralizado** - Toda la lógica en un lugar
2. **Reutilizable** - Misma lógica en toda la app
3. **Mantenible** - Fácil de modificar y extender
4. **Seguro** - Validaciones consistentes
5. **Performante** - Sin re-renders innecesarios
6. **Tipado** - TypeScript con tipos estrictos

## 🔒 Seguridad implementada:

- ✅ Validación de roles en el frontend Y backend
- ✅ Redirección automática cuando no hay permisos
- ✅ Protección de rutas específicas
- ✅ Verificación de permisos granulares
- ✅ Estado de loading manejado correctamente
- ✅ Usuarios inactivos redirigidos apropiadamente

## 🚀 Flujo después del login:

1. Usuario hace login
2. Sistema DAL analiza roles del usuario
3. Determina la página principal automáticamente
4. Redirige al usuario a su dashboard correspondiente
5. La página verifica permisos usando RouteGuard
6. Solo muestra contenido autorizado

## 📝 Ejemplo de uso completo:

```tsx
// En una página protegida
"use client";

import { RouteGuard } from "@/components/auth/route-guard";
import { usePermissions } from "@/app/hooks/use-authorization";

export default function PaginaAdmin() {
  return (
    <RouteGuard requiredPage="/main/admin">
      <ContenidoAdmin />
    </RouteGuard>
  );
}

function ContenidoAdmin() {
  const { canManageUsers, canManageContent, userRole } = usePermissions();

  return (
    <div>
      <h1>Panel de Administración</h1>
      <p>Rol actual: {userRole}</p>

      {canManageUsers && (
        <section>
          <h2>Gestión de Usuarios</h2>
          {/* Contenido para gestionar usuarios */}
        </section>
      )}

      {canManageContent && (
        <section>
          <h2>Gestión de Contenido</h2>
          {/* Contenido para gestionar contenido */}
        </section>
      )}
    </div>
  );
}
```

El sistema es completamente funcional y listo para usar. ¡Ahora tienes un control de acceso robusto y centralizado! 🎉
