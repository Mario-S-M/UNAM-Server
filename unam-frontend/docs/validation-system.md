# Sistema de Validación UNAM Frontend

Este documento describe el sistema de validación implementado en el frontend de UNAM, basado en Zod para garantizar la integridad y consistencia de los datos.

## Arquitectura del Sistema

### Componentes Principales

1. **Esquemas Zod** (`/schemas/`): Definiciones de validación para cada entidad
2. **Middleware de Validación** (`/lib/validation-middleware.ts`): Lógica centralizada de validación
3. **Utilidades de Validación** (`/lib/validation-utils.ts`): Funciones helper y validadores comunes
4. **Tipos Centralizados** (`/types/index.ts`): Tipos TypeScript derivados de esquemas Zod

## Esquemas de Validación

### Ubicación de Esquemas

Todos los esquemas Zod están organizados en el directorio `/schemas/`:

```
schemas/
├── skill-forms.ts      # Validación para habilidades
├── content-forms.ts    # Validación para contenido
├── level-forms.ts      # Validación para niveles
├── language-forms.ts   # Validación para idiomas
├── user-forms.ts       # Validación para usuarios
├── activity-forms.ts   # Validación para actividades
└── homework-forms.ts   # Validación para tareas
```

### Estructura de Esquemas

Cada archivo de esquema sigue esta estructura:

```typescript
// Esquema para crear entidad
export const CreateEntityFormSchema = z.object({
  // campos requeridos
});

// Esquema para actualizar entidad
export const UpdateEntityFormSchema = z.object({
  id: z.string().uuid(),
  // campos opcionales
});

// Esquema para filtros
export const EntityFiltersSchema = z.object({
  search: z.string().optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional()
});

// Tipos TypeScript derivados
export type CreateEntityFormData = z.infer<typeof CreateEntityFormSchema>;
export type UpdateEntityFormData = z.infer<typeof UpdateEntityFormSchema>;

// Funciones de validación
export const validateEntityForm = (data: unknown, isUpdate = false) => {
  const schema = isUpdate ? UpdateEntityFormSchema : CreateEntityFormSchema;
  return ValidationMiddleware.validateForm(schema, data);
};

// Funciones de limpieza
export const cleanEntityFormData = (data: Record<string, any>) => {
  return ValidationMiddleware.cleanFormData(data);
};
```

## Middleware de Validación

### Clase ValidationMiddleware

La clase `ValidationMiddleware` proporciona métodos estáticos para validación:

```typescript
import ValidationMiddleware from '@/lib/validation-middleware';

// Validación básica
const result = ValidationMiddleware.validate(schema, data);

// Validación con limpieza automática
const result = ValidationMiddleware.validateAndClean(schema, data);

// Validación de formularios
const result = ValidationMiddleware.validateForm(schema, formData);

// Validación de parámetros de API
const result = ValidationMiddleware.validateParams(schema, params);
```

### Resultado de Validación

Todos los métodos de validación retornan un objeto `ValidationResult`:

```typescript
interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}
```

## Utilidades de Validación

### Esquemas Comunes

La clase `ValidationUtils` incluye esquemas reutilizables:

```typescript
import { CommonSchemas } from '@/lib/validation-utils';

// UUID válido
CommonSchemas.uuid

// Email válido
CommonSchemas.email

// Texto no vacío
CommonSchemas.nonEmptyString

// Paginación
CommonSchemas.pagination
```

### Funciones Helper

```typescript
import ValidationUtils from '@/lib/validation-utils';

// Validar ID de entidad
const result = ValidationUtils.validateEntityId(id);

// Validar email con formato
const result = ValidationUtils.validateEmail(email);

// Validar archivos subidos
const result = ValidationUtils.validateFile(file, allowedTypes, maxSize);
```

## Implementación en Componentes

### Formularios de Administración

Ejemplo de implementación en un formulario:

```typescript
import { validateSkillForm, cleanSkillFormData } from '@/schemas/skill-forms';

const handleSubmit = async () => {
  try {
    // Limpiar datos del formulario
    const cleanedData = cleanSkillFormData(formData);
    
    // Validar datos
    const validation = validateSkillForm(cleanedData, isEditing);
    
    if (!validation.success) {
      toast.error(validation.errors?.join(', ') || 'Error de validación');
      return;
    }
    
    // Proceder con la mutación GraphQL
    await createSkill({ variables: { input: validation.data } });
    
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Hooks Personalizados

Ejemplo en `useContentManagement`:

```typescript
const handleCreate = async (formData: ContentFormData) => {
  try {
    const cleanedData = cleanContentFormData(formData);
    const validation = validateContentForm(cleanedData, false);
    
    if (!validation.success) {
      toast.error(validation.errors?.join(', ') || 'Error de validación');
      return;
    }
    
    await createContent({ variables: { input: validation.data } });
    
  } catch (error) {
    handleError(error);
  }
};
```

## Tipos Centralizados

### Archivo de Tipos Principal

Todos los tipos están centralizados en `/types/index.ts`:

```typescript
// Importar tipos de formularios
import type {
  CreateSkillFormData,
  UpdateSkillFormData
} from '../schemas/skill-forms';

// Importar tipos de entidades
import type {
  Skill,
  Content,
  Level
} from '../content/schemas';
```

### Migración de Tipos Existentes

Los archivos de tipos antiguos han sido marcados como deprecated:

```typescript
/**
 * @deprecated Este archivo está siendo migrado a /types/index.ts
 * Por favor, importa los tipos desde allí en su lugar.
 */

export type { Content } from '../../types';
```

## Mejores Prácticas

### 1. Validación Consistente

- Siempre usar los esquemas Zod definidos
- Limpiar datos antes de validar
- Manejar errores de validación apropiadamente

### 2. Mensajes de Error

- Usar mensajes descriptivos en español
- Mostrar errores específicos al usuario
- Registrar errores detallados en consola para debugging

### 3. Tipos TypeScript

- Usar tipos derivados de esquemas Zod
- Importar desde el archivo centralizado `/types/index.ts`
- Evitar duplicar definiciones de tipos

### 4. Esquemas Reutilizables

- Usar `CommonSchemas` para validaciones frecuentes
- Crear validadores personalizados cuando sea necesario
- Mantener esquemas simples y composables

## Ejemplos de Uso

### Validación de Formulario Completo

```typescript
import { validateSkillForm, CreateSkillFormData } from '@/schemas/skill-forms';
import { toast } from 'sonner';

const MyComponent = () => {
  const [formData, setFormData] = useState<CreateSkillFormData>({
    name: '',
    description: '',
    color: '#000000'
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateSkillForm(formData);
    
    if (!validation.success) {
      toast.error(validation.errors?.join(', '));
      return;
    }
    
    // Datos validados disponibles en validation.data
    console.log('Datos válidos:', validation.data);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* campos del formulario */}
    </form>
  );
};
```

### Validación de Archivos

```typescript
import ValidationUtils from '@/lib/validation-utils';

const handleFileUpload = (files: FileList) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  const validation = ValidationUtils.validateFiles(
    files,
    allowedTypes,
    maxSize,
    3 // máximo 3 archivos
  );
  
  if (!validation.success) {
    toast.error(validation.errors?.join(', '));
    return;
  }
  
  // Procesar archivos válidos
  validation.data?.forEach(file => {
    console.log('Archivo válido:', file.name);
  });
};
```

### Validación de API Response

```typescript
import { ContentSchema } from '@/content/schemas';
import ValidationMiddleware from '@/lib/validation-middleware';

const fetchContent = async (id: string) => {
  try {
    const response = await fetch(`/api/content/${id}`);
    const data = await response.json();
    
    const validation = ValidationMiddleware.validateApiData(
      ContentSchema,
      data
    );
    
    if (!validation.success) {
      throw new Error('Datos de API inválidos');
    }
    
    return validation.data;
    
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};
```

## Troubleshooting

### Errores Comunes

1. **"UUID inválido"**: Verificar que el ID sea un UUID v4 válido
2. **"Campo requerido"**: Asegurar que todos los campos obligatorios estén presentes
3. **"Tipo inválido"**: Verificar que el tipo de dato coincida con el esquema

### Debugging

```typescript
// Habilitar logging detallado
const validation = ValidationMiddleware.validate(schema, data, true);
console.log('Resultado de validación:', validation);
```

### Testing

```typescript
import { validateSkillForm } from '@/schemas/skill-forms';

describe('Skill Form Validation', () => {
  it('should validate correct skill data', () => {
    const validData = {
      name: 'JavaScript',
      description: 'Programming language',
      color: '#f7df1e'
    };
    
    const result = validateSkillForm(validData);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(validData);
  });
  
  it('should reject invalid skill data', () => {
    const invalidData = {
      name: '', // nombre vacío
      description: 'Test'
    };
    
    const result = validateSkillForm(invalidData);
    expect(result.success).toBe(false);
    expect(result.errors).toContain('El nombre no puede estar vacío');
  });
});
```

## Conclusión

Este sistema de validación proporciona:

- ✅ Validación consistente en toda la aplicación
- ✅ Tipos TypeScript seguros derivados de esquemas
- ✅ Mensajes de error descriptivos en español
- ✅ Reutilización de código y esquemas
- ✅ Fácil mantenimiento y extensión
- ✅ Integración perfecta con GraphQL y formularios

Para más información o dudas, consulta los archivos de esquemas individuales o el código fuente del middleware de validación.