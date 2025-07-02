import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidRoles } from '../enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';

interface CurrentUserOptions {
  optional?: boolean;
}

export const CurrentUser = createParamDecorator(
  (
    data: ValidRoles[] | [ValidRoles[], CurrentUserOptions] = [],
    context: ExecutionContext,
  ) => {
    const ctx = GqlExecutionContext.create(context);
    const user: User = ctx.getContext().req.user;

    // Extraer roles y opciones del parámetro data
    let roles: ValidRoles[] = [];
    let options: CurrentUserOptions = { optional: false };

    if (Array.isArray(data)) {
      if (
        data.length === 2 &&
        typeof data[1] === 'object' &&
        !Array.isArray(data[1])
      ) {
        // Formato: [roles[], options{}]
        roles = data[0] as ValidRoles[];
        options = { ...options, ...(data[1] as CurrentUserOptions) };
      } else {
        // Formato: roles[]
        roles = data as ValidRoles[];
      }
    }

    // Si no hay usuario y es opcional, devolver null
    if (!user && options.optional) {
      return null;
    }

    // Si no hay usuario y no es opcional, lanzar excepción
    if (!user) {
      throw new InternalServerErrorException(
        'Usuario no autenticado, por favor inicie sesión',
      );
    }

    // Si no hay roles requeridos, devolver el usuario
    if (roles.length === 0) return user;

    // Verificar roles
    for (const role of user.roles) {
      if (roles.includes(role as ValidRoles)) {
        return user;
      }
    }

    throw new ForbiddenException(
      `El usuario ${user.fullName} necesita el rol [${roles}] para acceder a este recurso`,
    );
  },
);
