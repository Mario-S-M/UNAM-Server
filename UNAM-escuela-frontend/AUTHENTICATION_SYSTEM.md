# Sistema de Autenticación con Redirección por Roles - UNAM

## 🎯 **Resumen del Sistema Implementado**

El sistema de autenticación ahora redirige automáticamente a los usuarios según su rol después del login exitoso.

## 📋 **Usuarios de Prueba**

| Email                  | Contraseña | Rol       | Redirección                             |
| ---------------------- | ---------- | --------- | --------------------------------------- |
| `admin@unam.mx`        | `123456`   | superUser | `/main/admin` (Panel de Administración) |
| `admin.normal@unam.mx` | `123456`   | admin     | `/main/admin` (Panel de Administración) |
| `maestro@unam.mx`      | `123456`   | docente   | `/main/teacher` (Panel del Maestro)     |
| `alumno@unam.mx`       | `123456`   | alumno    | `/main/student` (Panel del Estudiante)  |
| `usuario@unam.mx`      | `123456`   | mortal    | `/welcome` (Página de Bienvenida)       |

## 🔍 **Funcionalidades por Rol**

### 👑 **Super Administrador / Administrador**

- **Página:** `/main/admin`
- **Funciones:**
  - Gestión de usuarios y roles
  - Administración de contenido
  - Acceso a reportes (próximamente)
  - Configuración del sistema (próximamente)

### 👨‍🏫 **Maestro (Docente)**

- **Página:** `/main/teacher`
- **Funciones:**
  - Gestión de niveles educativos
  - Creación de contenido (próximamente)
  - Seguimiento de estudiantes (próximamente)
  - Reportes de aprendizaje (próximamente)

### 👨‍🎓 **Estudiante (Alumno)**

- **Página:** `/main/student`
- **Funciones:**
  - Acceso a cursos y niveles
  - Seguimiento de progreso personal (próximamente)
  - Visualización de logros (próximamente)
  - Gestión de perfil (próximamente)

### 👤 **Usuario Normal (Mortal)**

- **Página:** `/welcome`
- **Funciones:**
  - Acceso básico al contenido público
  - Información general del sistema

## 🧪 **Instrucciones de Prueba**

### 1. **Verificar Toast de Notificaciones**

- Al hacer login exitoso: Toast verde con mensaje "¡Bienvenido! Hola [nombre]..."
- Al fallar login: Toast rojo con mensaje de error específico

### 2. **Verificar Redirección por Roles**

1. Ir a `http://localhost:3001`
2. Hacer clic en "Iniciar Sesión"
3. Probar cada usuario y verificar que redirija a la página correcta
4. Verificar que el header muestre el badge del rol (excepto usuarios "mortal")

### 3. **Verificar Protección de Rutas**

- Los usuarios solo deben poder acceder a páginas de su rol
- Usuarios no autenticados deben ser redirigidos al inicio

## ✅ **Características Implementadas**

- ✅ **Modal de login sin sombra**
- ✅ **Toast de notificaciones con HeroUI**
- ✅ **Redirección automática por rol**
- ✅ **Páginas específicas para cada tipo de usuario**
- ✅ **Sistema de badges de rol (sin badge para usuarios "mortal")**
- ✅ **Autenticación JWT con cookies HTTP-only**
- ✅ **Validación de formularios**
- ✅ **Manejo de errores**
- ✅ **Estado de carga en el login**

## 🎨 **Colores de Badges por Rol**

- **Super Administrador:** Rojo (`danger`)
- **Administrador:** Naranja (`warning`)
- **Maestro:** Azul (`primary`)
- **Alumno:** Verde (`success`)
- **Usuario Normal:** Sin badge

## 🚀 **Servidores**

- **Backend (NestJS + GraphQL):** `http://localhost:3000`
- **Frontend (Next.js):** `http://localhost:3001`

## 📝 **Notas Importantes**

1. El sistema prioriza roles: `superUser > admin > docente > alumno > mortal`
2. Las cookies JWT se almacenan de forma segura (HTTP-only)
3. El estado de autenticación se sincroniza automáticamente
4. Algunas funcionalidades están marcadas como "Próximamente" para desarrollo futuro

---

**Fecha de implementación:** 15 de junio de 2025
**Estado:** ✅ Completamente funcional
