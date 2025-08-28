// GraphQL Fragments para optimizar consultas
// Solo incluye los campos que realmente se necesitan en cada contexto

// Fragment básico para listados de idiomas (solo campos mostrados en tabla)
export const LANGUAGE_LIST_FRAGMENT = `
  fragment LanguageListFields on Lenguage {
    id
    name
    eslogan_atractivo
    nivel
    duracion_total_horas
    estado
    badge_destacado
    puntuacion_promedio
    total_estudiantes_inscritos
    featured
    icons
    isActive
    createdAt
    updatedAt
  }
`;

// Fragment completo para formularios de edición
export const LANGUAGE_FORM_FRAGMENT = `
  fragment LanguageFormFields on Lenguage {
    id
    name
    eslogan_atractivo
    descripcion_corta
    descripcion_completa
    nivel
    duracion_total_horas
    color_tema
    icono_curso
    imagen_hero
    badge_destacado
    idioma_origen
    idioma_destino
    certificado_digital
    puntuacion_promedio
    total_estudiantes_inscritos
    estado
    featured
    fecha_creacion
    fecha_actualizacion
    icons
    isActive
    createdAt
    updatedAt
  }
`;

// Fragment mínimo para selects/dropdowns
export const LANGUAGE_SELECT_FRAGMENT = `
  fragment LanguageSelectFields on Lenguage {
    id
    name
  }
`;

// Fragment básico para listados de niveles
export const LEVEL_LIST_FRAGMENT = `
  fragment LevelListFields on Level {
    id
    name
    description
    difficulty
    isActive
    lenguageId
    lenguage {
      id
      name
    }
    createdAt
    updatedAt
  }
`;

// Fragment mínimo para selects de niveles
export const LEVEL_SELECT_FRAGMENT = `
  fragment LevelSelectFields on Level {
    id
    name
    difficulty
  }
`;

// Fragment básico para listados de skills
export const SKILL_LIST_FRAGMENT = `
  fragment SkillListFields on Skill {
    id
    name
    description
    color
    difficulty
    estimatedHours
    isActive
    levelId
    lenguageId
    level {
      id
      name
      difficulty
    }
    lenguage {
      id
      name
    }
    createdAt
    updatedAt
  }
`;

// Fragment completo para formularios de skills
export const SKILL_FORM_FRAGMENT = `
  fragment SkillFormFields on Skill {
    id
    name
    description
    color
    imageUrl
    icon
    objectives
    prerequisites
    difficulty
    estimatedHours
    tags
    isActive
    levelId
    lenguageId
    level {
      id
      name
      description
      difficulty
    }
    lenguage {
      id
      name
    }
    createdAt
    updatedAt
  }
`;

// Fragment mínimo para selects de skills
export const SKILL_SELECT_FRAGMENT = `
  fragment SkillSelectFields on Skill {
    id
    name
    color
  }
`;

// Fragment básico para listados de usuarios
export const USER_LIST_FRAGMENT = `
  fragment UserListFields on User {
    id
    fullName
    email
    roles
    isActive
    assignedLanguages {
      id
      name
    }
  }
`;

// Fragment mínimo para selects de usuarios
export const USER_SELECT_FRAGMENT = `
  fragment UserSelectFields on User {
    id
    fullName
    email
  }
`;

// Fragment básico para listados de contenido
export const CONTENT_LIST_FRAGMENT = `
  fragment ContentListFields on Content {
    id
    name
    description
    validationStatus
    skill {
      id
      name
      color
    }
    assignedTeachers {
      id
      fullName
      email
    }
  }
`;

// Fragment para respuestas de mutaciones (solo campos esenciales)
export const MUTATION_RESPONSE_FRAGMENT = `
  fragment MutationResponseFields on Lenguage {
    id
    name
    isActive
    createdAt
    updatedAt
  }
`;

// Fragment para respuestas de mutaciones de niveles
export const LEVEL_MUTATION_RESPONSE_FRAGMENT = `
  fragment LevelMutationResponseFields on Level {
    id
    name
    difficulty
    isActive
    lenguageId
    createdAt
    updatedAt
  }
`;

// Fragment para respuestas de mutaciones de skills
export const SKILL_MUTATION_RESPONSE_FRAGMENT = `
  fragment SkillMutationResponseFields on Skill {
    id
    name
    isActive
    levelId
    lenguageId
    createdAt
    updatedAt
  }
`;

// Fragment para eliminaciones (solo campos mínimos)
export const DELETE_RESPONSE_FRAGMENT = `
  fragment DeleteResponseFields on Lenguage {
    id
    name
  }
`;

export const LEVEL_DELETE_RESPONSE_FRAGMENT = `
  fragment LevelDeleteResponseFields on Level {
    id
    name
  }
`;

export const SKILL_DELETE_RESPONSE_FRAGMENT = `
  fragment SkillDeleteResponseFields on Skill {
    id
    name
  }
`;

// Fragment para respuestas de mutaciones de usuarios
export const USER_MUTATION_RESPONSE_FRAGMENT = `
  fragment UserMutationResponseFields on User {
    id
    fullName
    email
    roles
    isActive
    assignedLanguageId
    assignedLanguage {
      id
      name
    }
  }
`;

export const USER_DELETE_RESPONSE_FRAGMENT = `
  fragment UserDeleteResponseFields on User {
    id
    fullName
    email
  }
`;

// Fragments para consultas públicas del sidebar

// Fragment para skills públicas por nivel (sidebar)
export const SKILL_PUBLIC_FRAGMENT = `
  fragment SkillPublicFields on Skill {
    id
    name
    description
    color
    difficulty
    estimatedHours
    tags
    isActive
  }
`;

// Fragment para contenidos públicos (sidebar)
export const CONTENT_PUBLIC_FRAGMENT = `
  fragment ContentPublicFields on Content {
    id
    name
    description
    isCompleted
    validationStatus
    publishedAt
    skill {
      id
      name
    }
  }
`;

// Fragment para respuestas de mutaciones de contenido
export const CONTENT_MUTATION_RESPONSE_FRAGMENT = `
  fragment ContentMutationResponseFields on Content {
    id
    name
    description
    validationStatus
    skill {
      id
      name
      color
    }
    assignedTeachers {
      id
      fullName
      email
      roles
      isActive
    }
  }
`;

// Fragment para eliminaciones de contenido
export const CONTENT_DELETE_RESPONSE_FRAGMENT = `
  fragment ContentDeleteResponseFields on Content {
    id
    name
  }
`;