-- Script para insertar skills de ejemplo
-- Ejecutar este script en la base de datos PostgreSQL

INSERT INTO skills (id, name, description, color, "isActive", "createdAt", "updatedAt") VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Variables y Tipos de Datos', 'Aprende sobre variables, tipos de datos primitivos y su uso en programación', '#3B82F6', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Estructuras de Control', 'Domina las estructuras condicionales y bucles para controlar el flujo del programa', '#10B981', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Funciones', 'Comprende cómo crear y usar funciones para organizar tu código', '#F59E0B', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Arrays y Listas', 'Trabaja con estructuras de datos como arrays y listas para almacenar múltiples valores', '#EF4444', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Objetos y Clases', 'Aprende programación orientada a objetos con clases, objetos y métodos', '#8B5CF6', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'Manejo de Errores', 'Implementa técnicas para manejar errores y excepciones en tu código', '#F97316', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440007', 'Algoritmos de Búsqueda', 'Implementa algoritmos de búsqueda lineal y binaria', '#06B6D4', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440008', 'Algoritmos de Ordenamiento', 'Aprende algoritmos de ordenamiento como bubble sort, merge sort y quick sort', '#84CC16', true, NOW(), NOW());

-- Verificar que las skills se insertaron correctamente
SELECT * FROM skills WHERE "isActive" = true ORDER BY name;