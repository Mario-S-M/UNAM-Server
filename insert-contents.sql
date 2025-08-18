-- Script para insertar contenidos de ejemplo asociados a las skills
-- Primero necesitamos obtener los IDs de los niveles existentes

-- Insertar contenidos para diferentes skills
INSERT INTO contents (id, name, description, "isCompleted", "createdAt", "updatedAt", "levelId", "userId", "markdownPath", "validationStatus", "publishedAt", "skillId") 
SELECT 
    gen_random_uuid(),
    'Introducción a Variables',
    'Aprende los conceptos básicos de variables en programación',
    false,
    NOW(),
    NOW(),
    l.id,
    1,
    '/content/variables-intro.md',
    'validado',
    NOW(),
    '550e8400-e29b-41d4-a716-446655440001'
FROM levels l 
WHERE l."isActive" = true 
LIMIT 1;

INSERT INTO contents (id, name, description, "isCompleted", "createdAt", "updatedAt", "levelId", "userId", "markdownPath", "validationStatus", "publishedAt", "skillId") 
SELECT 
    gen_random_uuid(),
    'Tipos de Datos Primitivos',
    'Explora los diferentes tipos de datos: números, strings, booleanos',
    false,
    NOW(),
    NOW(),
    l.id,
    1,
    '/content/tipos-datos.md',
    'validado',
    NOW(),
    '550e8400-e29b-41d4-a716-446655440001'
FROM levels l 
WHERE l."isActive" = true 
LIMIT 1;

INSERT INTO contents (id, name, description, "isCompleted", "createdAt", "updatedAt", "levelId", "userId", "markdownPath", "validationStatus", "publishedAt", "skillId") 
SELECT 
    gen_random_uuid(),
    'Estructuras If-Else',
    'Aprende a usar condicionales para tomar decisiones en tu código',
    false,
    NOW(),
    NOW(),
    l.id,
    1,
    '/content/if-else.md',
    'validado',
    NOW(),
    '550e8400-e29b-41d4-a716-446655440002'
FROM levels l 
WHERE l."isActive" = true 
LIMIT 1;

INSERT INTO contents (id, name, description, "isCompleted", "createdAt", "updatedAt", "levelId", "userId", "markdownPath", "validationStatus", "publishedAt", "skillId") 
SELECT 
    gen_random_uuid(),
    'Bucles For y While',
    'Domina los bucles para repetir acciones en tu programa',
    false,
    NOW(),
    NOW(),
    l.id,
    1,
    '/content/bucles.md',
    'validado',
    NOW(),
    '550e8400-e29b-41d4-a716-446655440002'
FROM levels l 
WHERE l."isActive" = true 
LIMIT 1;

INSERT INTO contents (id, name, description, "isCompleted", "createdAt", "updatedAt", "levelId", "userId", "markdownPath", "validationStatus", "publishedAt", "skillId") 
SELECT 
    gen_random_uuid(),
    'Definición de Funciones',
    'Aprende a crear y llamar funciones en tu código',
    false,
    NOW(),
    NOW(),
    l.id,
    1,
    '/content/funciones-definicion.md',
    'validado',
    NOW(),
    '550e8400-e29b-41d4-a716-446655440003'
FROM levels l 
WHERE l."isActive" = true 
LIMIT 1;

INSERT INTO contents (id, name, description, "isCompleted", "createdAt", "updatedAt", "levelId", "userId", "markdownPath", "validationStatus", "publishedAt", "skillId") 
SELECT 
    gen_random_uuid(),
    'Parámetros y Argumentos',
    'Comprende cómo pasar datos a las funciones',
    false,
    NOW(),
    NOW(),
    l.id,
    1,
    '/content/parametros-argumentos.md',
    'validado',
    NOW(),
    '550e8400-e29b-41d4-a716-446655440003'
FROM levels l 
WHERE l."isActive" = true 
LIMIT 1;

-- Verificar que los contenidos se insertaron correctamente
SELECT c.name, s.name as skill_name, c."validationStatus" 
FROM contents c 
JOIN skills s ON c."skillId" = s.id 
WHERE c."validationStatus" = 'validado' 
ORDER BY s.name, c.name;