/**
 * Utilidades para el manejo de roles y sus estilos
 */

export type RoleType = 'superUser' | 'admin' | 'docente' | 'alumno' | 'mortal';

/**
 * Mapeo de roles a sus etiquetas legibles
 */
export const ROLE_LABELS: Record<RoleType, string> = {
  superUser: 'Super Usuario',
  admin: 'Administrador', 
  docente: 'Profesor',
  alumno: 'Estudiante',
  mortal: 'Usuario'
};

/**
 * Obtiene la etiqueta legible de un rol
 */
export const getRoleLabel = (role: string): string => {
  return ROLE_LABELS[role as RoleType] || role;
};

/**
 * Obtiene la variante del badge y clases CSS personalizadas para cada rol
 */
export function getRoleBadgeProps(role: RoleType): {
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  className: string;
} {
  switch (role) {
    case 'mortal':
      return {
        variant: 'outline',
        className: '!bg-gray-100 !text-gray-800 !border-gray-200'
      };
    case 'docente':
      return {
        variant: 'outline',
        className: '!bg-blue-100 !text-blue-800 !border-blue-200'
      };
    case 'superUser':
      return {
        variant: 'outline',
        className: '!bg-purple-100 !text-purple-800 !border-purple-200'
      };
    case 'admin':
      return {
        variant: 'outline',
        className: '!bg-green-100 !text-green-800 !border-green-200'
      };
    case 'alumno':
      return {
        variant: 'outline',
        className: '!bg-yellow-100 !text-yellow-800 !border-yellow-200'
      };
    default:
      return {
        variant: 'secondary',
        className: ''
      };
  }
}