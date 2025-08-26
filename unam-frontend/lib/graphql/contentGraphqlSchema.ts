// Consultas para Languages
export const GET_ACTIVE_LANGUAGES = `
  query LenguagesActivate {
    lenguagesActivate {
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
  }
`;

// Consultas para Skills
export const GET_ACTIVE_SKILLS = `
  query SkillsActivePublic {
    skillsActivePublic {
      id
      name
      description
      color
      isActive
      createdAt
      updatedAt
    }
  }
`;

// Consultas para Levels
export const GET_LEVELS_BY_LANGUAGE = `
  query LevelsByLenguage($lenguageId: ID!) {
    levelsByLenguage(lenguageId: $lenguageId) {
      id
      name
      description
      isCompleted
      percentaje
      qualification
      createdAt
      updatedAt
      userId
      isActive
      difficulty
      lenguageId
    }
  }
`;

// Consultas para Contents
export const GET_CONTENTS_BY_LEVEL = `
  query ContentsByLevelPublic($levelId: ID!) {
    contentsByLevelPublic(levelId: $levelId) {
      id
      name
      description
      isCompleted
      createdAt
      updatedAt
      levelId
      userId
      markdownPath
      assignedTeachers {
        id
        fullName
        email
        roles
        isActive
      }
      validationStatus
      publishedAt
      skill {
        id
        name
        description
        color
        isActive
        createdAt
        updatedAt
      }
      skillId
    }
  }
`;

export const GET_CONTENTS_BY_SKILL = `
  query ContentsBySkillPublic($skillId: ID!) {
    contentsBySkillPublic(skillId: $skillId) {
      id
      name
      description
      isCompleted
      createdAt
      updatedAt
      levelId
      userId
      markdownPath
      assignedTeachers {
        id
        fullName
        email
        roles
        isActive
      }
      validationStatus
      publishedAt
      skill {
        id
        name
        description
        color
        isActive
        createdAt
        updatedAt
      }
      skillId
    }
  }
`;

export const GET_CONTENTS_BY_LEVEL_AND_SKILL = `
  query ContentsByLevelAndSkillPublic($levelId: ID!, $skillId: ID!) {
    contentsByLevelAndSkillPublic(levelId: $levelId, skillId: $skillId) {
      id
      name
      description
      isCompleted
      createdAt
      updatedAt
      levelId
      userId
      markdownPath
      assignedTeachers {
        id
        fullName
        email
        roles
        isActive
      }
      validationStatus
      publishedAt
      skill {
        id
        name
        description
        color
        isActive
        createdAt
        updatedAt
      }
      skillId
    }
  }
`;

// Consulta para contenidos asignados al docente
export const GET_MY_ASSIGNED_CONTENTS = `
  query MyAssignedContents {
    myAssignedContents {
      id
      name
      description
      isCompleted
      createdAt
      updatedAt
      levelId
      userId
      markdownPath
      assignedTeachers {
        id
        fullName
        email
        roles
        isActive
      }
      validationStatus
      publishedAt
      skill {
        id
        name
        description
        color
        isActive
        createdAt
        updatedAt
      }
      skillId
    }
  }
`;