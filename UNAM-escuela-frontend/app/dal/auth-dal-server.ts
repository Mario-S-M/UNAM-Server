import { User } from "@/app/interfaces/auth-interfaces";

/**
 * Versión servidor del AuthDAL para usar en server actions
 * Contiene solo las funciones necesarias sin hooks de React
 */

export type Role = "superUser" | "admin" | "docente" | "alumno" | "mortal";

export interface RoleHierarchy {
  [key: string]: {
    level: number;
    permissions: string[];
    redirectTo: string;
    displayName: string;
  };
}

const ROLE_HIERARCHY: RoleHierarchy = {
  superUser: {
    level: 5,
    permissions: [
      "admin",
      "teacher",
      "student",
      "content_management",
      "user_management",
      "debug",
    ],
    redirectTo: "/main/admin-dashboard",
    displayName: "Super Administrador",
  },
  admin: {
    level: 4,
    permissions: [
      "teacher",
      "student",
      "content_management",
      "user_management",
    ],
    redirectTo: "/main/admin-dashboard",
    displayName: "Administrador",
  },
  docente: {
    level: 3,
    permissions: ["teacher", "content_view"],
    redirectTo: "/main/teacher",
    displayName: "Maestro",
  },
  alumno: {
    level: 2,
    permissions: ["student"],
    redirectTo: "/main/student",
    displayName: "Alumno",
  },
  mortal: {
    level: 1,
    permissions: [],
    redirectTo: "/main",
    displayName: "Usuario",
  },
};

/**
 * Obtiene el rol más alto del usuario
 */
export function getHighestRole(user: User | null): Role | null {
  if (!user || !user.roles || user.roles.length === 0) {
    return null;
  }

  let highestRole: Role = "mortal";
  let highestLevel = 0;

  for (const role of user.roles) {
    const roleData = ROLE_HIERARCHY[role as Role];
    if (roleData && roleData.level > highestLevel) {
      highestLevel = roleData.level;
      highestRole = role as Role;
    }
  }

  return highestRole;
}

/**
 * Obtiene la página principal del usuario según su rol más alto
 */
export function getUserMainPage(user: User | null): string {
  const highestRole = getHighestRole(user);
  if (!highestRole) return "/main";

  return ROLE_HIERARCHY[highestRole].redirectTo;
}

/**
 * Verifica si el usuario tiene un permiso específico
 */
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user || !user.roles) return false;

  return user.roles.some((role) => {
    const roleData = ROLE_HIERARCHY[role as Role];
    return roleData?.permissions.includes(permission) || false;
  });
}

/**
 * Verifica si el usuario tiene al menos uno de los roles especificados
 */
export function hasAnyRole(user: User | null, roles: Role[]): boolean {
  if (!user || !user.roles) return false;
  return user.roles.some((userRole) => roles.includes(userRole as Role));
}
