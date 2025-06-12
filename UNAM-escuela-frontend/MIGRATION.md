# UNAM Escuela Frontend - Migración a TanStack Query

## 🚀 Migración Completada

Este proyecto ha sido **completamente migrado** de Apollo Client a TanStack Query, eliminando todas las dependencias de GraphQL del cliente y utilizando únicamente server actions con fetch.

## 📋 Cambios Realizados

### ✅ Eliminaciones

- ❌ `@apollo/client` - Completamente removido
- ❌ `graphql` - Eliminado del package.json
- ❌ `lib/apollo-client.ts` - Archivo eliminado
- ❌ `app/queries/` - Directorio completo eliminado
- ❌ Todas las importaciones de `gql` y Apollo Client

### ✅ Nuevas Implementaciones

#### 1. **Server Actions Puras** (`app/actions/`)

- `auth-actions.ts` - Autenticación con fetch
- `level-actions.ts` - CRUD de niveles
- `lenguage-actions.ts` - Consulta de lenguajes
- `content-actions.ts` - Gestión de contenidos
- `activity-actions.ts` - Manejo de actividades
- `user-actions.ts` - Administración de usuarios

#### 2. **Hooks de TanStack Query** (`app/hooks/`)

- `use-auth.ts` - Hook para autenticación
- `use-levels.ts` - Hooks para niveles (queries y mutations)
- `use-lenguages.ts` - Hook para lenguajes activos
- `use-contents.ts` - Hooks para contenidos
- `use-activities.ts` - Hooks para actividades
- `use-users.ts` - Hooks para usuarios

#### 3. **Componentes de Ejemplo**

- `components/levels/LevelsList.tsx` - Lista de niveles con TanStack Query
- `components/languages/LanguagesList.tsx` - Lista de lenguajes

#### 4. **Tipos y Utilidades**

- `app/types/graphql.ts` - Tipos para respuestas GraphQL
- Interfaces actualizadas con `isActive` en lenguajes

## 🛠️ Arquitectura

### Flujo de Datos

```
Componente React → Hook TanStack Query → Server Action → Fetch API → GraphQL Backend
```

### Ejemplo de Uso

```tsx
// Antes (Apollo Client)
const { data, loading, error } = useQuery(GET_LEVELS);

// Ahora (TanStack Query + Actions)
const { data, isLoading, error } = useLevelsByLanguage(languageId);
```

### Server Action

```ts
export async function getLevelsByLenguage(id: string): Promise<LevelsResponse> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query LevelsByLenguage($lenguageId: ID!) { ... }`,
      variables: { lenguageId: id },
    }),
  });

  // Validación y respuesta
  return { data: validated.data.data.levelsByLenguage };
}
```

## 🔧 Configuración

### Dependencias Principales

- `@tanstack/react-query` - Para manejo de estado del servidor
- `@tanstack/react-query-devtools` - Herramientas de desarrollo
- `@heroui/react` - Componentes UI
- `zod` - Validación de esquemas

### Configuración del Provider

```tsx
// app/providers.tsx
<QueryClientProvider client={queryClient}>
  <ReactQueryDevtools initialIsOpen={false} />
  {/* Resto de providers */}
</QueryClientProvider>
```

## 📊 Beneficios de la Migración

1. **Simplicidad**: Sin dependencias de GraphQL en el cliente
2. **Performance**: Cache inteligente de TanStack Query
3. **Developer Experience**: Mejor debugging y devtools
4. **Flexibilidad**: Fácil migración a REST en el futuro
5. **Bundle Size**: Reducción significativa del tamaño del bundle

## 🚀 Comandos

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build de producción
npm run build

# Lint
npm run lint
```

## 🔍 Estado del Proyecto

- ✅ **Compilación**: Sin errores
- ⚠️ **ESLint**: Solo warnings sobre tipos `any` (no críticos)
- ✅ **TypeScript**: Tipos correctos
- ✅ **Funcionalidad**: Server completamente funcional

## 📝 Próximos Pasos

1. **Refinamiento de tipos**: Reemplazar `any` con tipos específicos
2. **Testing**: Agregar tests para los hooks y actions
3. **Error Handling**: Mejorar manejo de errores
4. **Optimización**: Cache strategies avanzadas

---

## 🎯 Resultado

**La migración está 100% completa y funcional.** El proyecto ahora usa exclusivamente TanStack Query con server actions, eliminando completamente Apollo Client del frontend mientras mantiene la compatibilidad con el backend GraphQL.
