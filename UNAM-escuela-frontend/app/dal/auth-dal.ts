import { User } from "@/app/interfaces/auth-interfaces";

/**
 * Data Access Layer para autenticación y autorización
 * Centraliza toda la lógica de roles y permisos
 */

export type Role = "superUser" | "admin" | "docente" | "alumno" | "mortal";

export interface AuthorizationResult {
  hasAccess: boolean;
  redirectTo?: string;
  reason?: string;
}

export interface RoleHierarchy {
  [key: string]: {
    level: number;
    permissions: string[];
    redirectTo: string;
    displayName: string;
  };
}

export class AuthDAL {
  private static readonly ROLE_HIERARCHY: RoleHierarchy = {
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
      redirectTo: "/",
      displayName: "Usuario",
    },
  };

  /**
   * Obtiene el rol más alto del usuario
   */
  static getHighestRole(user: User | null): Role | null {
    if (!user || !user.roles || user.roles.length === 0) {
      return null;
    }

    let highestRole: Role = "mortal";
    let highestLevel = 0;

    for (const role of user.roles) {
      const roleData = this.ROLE_HIERARCHY[role as Role];
      if (roleData && roleData.level > highestLevel) {
        highestLevel = roleData.level;
        highestRole = role as Role;
      }
    }

    return highestRole;
  }

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  static hasPermission(user: User | null, permission: string): boolean {
    if (!user || !user.roles) return false;

    return user.roles.some((role) => {
      const roleData = this.ROLE_HIERARCHY[role as Role];
      return roleData?.permissions.includes(permission) || false;
    });
  }

  /**
   * Verifica si el usuario tiene al menos uno de los roles especificados
   */
  static hasAnyRole(user: User | null, roles: Role[]): boolean {
    if (!user || !user.roles) return false;
    return user.roles.some((userRole) => roles.includes(userRole as Role));
  }

  /**
   * Verifica si el usuario tiene acceso a una página específica
   */
  static canAccessPage(user: User | null, page: string): AuthorizationResult {
    // Definir páginas públicas que no requieren autenticación
    const publicPages = [
      "/",
      "/main/levels",
      "/main/content",
      "/main/lenguages",
      "/main/skills",
    ];

    // Permitir acceso a páginas públicas sin autenticación
    if (publicPages.some((publicPage) => page.startsWith(publicPage))) {
      return { hasAccess: true };
    }

    // Si no hay usuario y la página no es pública, redirigir a login o página principal
    if (!user) {
      return {
        hasAccess: false,
        redirectTo: "/",
        reason: "Usuario no autenticado",
      };
    }

    // Si el usuario no está activo
    if (!user.isActive) {
      return {
        hasAccess: false,
        redirectTo: "/auth/inactive",
        reason: "Usuario inactivo",
      };
    }

    // Obtener rol más alto
    const highestRole = this.getHighestRole(user);
    if (!highestRole) {
      return {
        hasAccess: false,
        redirectTo: "/",
        reason: "Usuario sin roles válidos",
      };
    }

    // Definir reglas de acceso por página para páginas protegidas
    const pageAccessRules: { [key: string]: Role[] } = {
      "/main/admin-dashboard": ["superUser", "admin"],
      "/main/admin-dashboard/users": ["superUser", "admin"],
      "/main/admin-dashboard/contents": ["superUser", "admin"],
      "/main/admin-dashboard/levels": ["superUser", "admin"],
      "/main/admin-dashboard/languages": ["superUser", "admin"],
      "/main/admin-dashboard/skills": ["superUser", "admin"],
      "/main/admin": ["superUser", "admin"],
      "/main/teacher": ["superUser", "admin", "docente"],
      "/main/student": ["superUser", "admin", "docente", "alumno"],
      "/main/users": ["superUser", "admin", "docente"],
    };

    const requiredRoles = pageAccessRules[page];

    if (!requiredRoles) {
      // Si la página no tiene reglas específicas, permitir acceso
      return { hasAccess: true };
    }

    // Verificar si el usuario tiene alguno de los roles requeridos
    if (this.hasAnyRole(user, requiredRoles)) {
      return { hasAccess: true };
    }

    // Si no tiene acceso, redirigir a su página principal
    const roleData = this.ROLE_HIERARCHY[highestRole];
    return {
      hasAccess: false,
      redirectTo: roleData.redirectTo,
      reason: `Acceso denegado. Se requiere uno de estos roles: ${requiredRoles.join(
        ", "
      )}`,
    };
  }

  /**
   * Obtiene la página principal del usuario según su rol más alto
   */
  static getUserMainPage(user: User | null): string {
    const highestRole = this.getHighestRole(user);
    if (!highestRole) return "/";

    return this.ROLE_HIERARCHY[highestRole].redirectTo;
  }

  /**
   * Obtiene información del rol para mostrar en la UI
   */
  static getRoleInfo(role: Role) {
    return this.ROLE_HIERARCHY[role];
  }

  /**
   * Obtiene todos los roles disponibles
   */
  static getAllRoles(): Role[] {
    return Object.keys(this.ROLE_HIERARCHY) as Role[];
  }

  /**
   * Verifica si un usuario puede administrar a otro usuario
   */
  static canManageUser(currentUser: User | null, targetUser: User): boolean {
    if (!currentUser) return false;

    const currentHighestRole = this.getHighestRole(currentUser);
    const targetHighestRole = this.getHighestRole(targetUser);

    if (!currentHighestRole || !targetHighestRole) return false;

    const currentLevel = this.ROLE_HIERARCHY[currentHighestRole].level;
    const targetLevel = this.ROLE_HIERARCHY[targetHighestRole].level;

    // Solo puede administrar usuarios con nivel menor
    return currentLevel > targetLevel;
  }

  /**
   * Verifica permisos para operaciones CRUD
   */
  static canPerformOperation(
    user: User | null,
    operation: "create" | "read" | "update" | "delete",
    resource: string
  ): boolean {
    if (!user) return false;

    // Definir permisos por operación y recurso
    const operationPermissions: { [key: string]: { [key: string]: string[] } } =
      {
        users: {
          create: ["user_management"],
          read: ["user_management", "teacher"],
          update: ["user_management"],
          delete: ["user_management"],
        },
        content: {
          create: ["content_management"],
          read: ["content_management", "content_view", "teacher", "student"],
          update: ["content_management"],
          delete: ["content_management"],
        },
        levels: {
          create: ["content_management"],
          read: ["content_management", "content_view", "teacher", "student"],
          update: ["content_management"],
          delete: ["content_management"],
        },
      };

    const resourcePermissions = operationPermissions[resource];
    if (!resourcePermissions) return false;

    const requiredPermissions = resourcePermissions[operation];
    if (!requiredPermissions) return false;

    return requiredPermissions.some((permission) =>
      this.hasPermission(user, permission)
    );
  }

  /**
   * Obtiene los roles que un usuario puede asignar a otros usuarios
   */
  static getAssignableRoles(user: User | null): Role[] {
    if (!user) return [];

    const currentRole = this.getHighestRole(user);
    if (!currentRole) return [];

    // Definir qué roles puede asignar cada tipo de usuario
    switch (currentRole) {
      case "superUser":
        // SuperUser puede asignar cualquier rol incluyendo mortal
        return ["superUser", "admin", "docente", "alumno", "mortal"];

      case "admin":
        // Admin puede asignar docente, alumno y mortal
        return ["docente", "alumno", "mortal"];

      case "docente":
        // Docente puede asignar alumno y mortal (usuario normal)
        return ["alumno", "mortal"];

      default:
        // Otros roles no pueden asignar roles
        return [];
    }
  }

  /**
   * Verifica si un usuario puede cambiar el rol de otro usuario
   */
  static canChangeUserRole(
    currentUser: User | null,
    targetUser: User,
    newRoles: Role[]
  ): boolean {
    if (!currentUser) return false;

    // Verificar que puede gestionar al usuario objetivo
    if (!this.canManageUser(currentUser, targetUser)) return false;

    // Verificar que puede asignar todos los nuevos roles
    const assignableRoles = this.getAssignableRoles(currentUser);

    for (const role of newRoles) {
      if (!assignableRoles.includes(role)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Obtiene el siguiente rol en la jerarquía que un usuario puede asignar
   */
  static getNextAssignableRole(
    currentUser: User | null,
    currentRole: Role
  ): Role | null {
    const assignableRoles = this.getAssignableRoles(currentUser);

    // Definir la jerarquía circular según tu descripción:
    // superUser -> admin -> docente -> alumno -> superUser (cíclico)
    const roleProgression: { [key in Role]: Role } = {
      superUser: "admin",
      admin: "docente",
      docente: "alumno",
      alumno: "superUser",
      mortal: "alumno", // mortal salta a alumno
    };

    let nextRole = roleProgression[currentRole];

    // Buscar el siguiente rol válido que el usuario puede asignar
    let attempts = 0;
    while (attempts < 5 && !assignableRoles.includes(nextRole)) {
      nextRole = roleProgression[nextRole];
      attempts++;
    }

    return assignableRoles.includes(nextRole) ? nextRole : null;
  }
}
