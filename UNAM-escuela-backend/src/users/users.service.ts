import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { SignupInput } from '../auth/dto/inputs/signup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { PaginatedUsers } from './dto/paginated-users.output';
import { UsersFilterArgs } from './dto/args/users-filter.arg';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('UsersService');
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      this.logger.log(`Creando nuevo usuario con email: ${signupInput.email}`);
      const newUser = this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
        roles: ['mortal'], // Asignar automáticamente el rol de usuario normal
      });
      const savedUser = await this.usersRepository.save(newUser);
      this.logger.log(
        `Usuario creado exitosamente: ${savedUser.email} (ID: ${savedUser.id}) con rol de usuario normal`,
      );
      return savedUser;
    } catch (error) {
      this.logger.error(
        `Error creando usuario con email: ${signupInput.email} - ${error.message}`,
      );
      this.handleDBError(error);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if (roles.length === 0) return await this.usersRepository.find();
    return this.usersRepository
      .createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany();
  }

  async findPaginated(filters: UsersFilterArgs): Promise<PaginatedUsers> {
    const { roles = [], search, page = 1, limit = 10 } = filters;

    let query = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.lastUpdateBy', 'lastUpdateBy');

    // Filtrar por roles si se especifican
    if (roles.length > 0) {
      query = query
        .andWhere('ARRAY[user.roles] && ARRAY[:...roles]')
        .setParameter('roles', roles);
    }

    // Filtrar por búsqueda si se especifica
    if (search && search.trim()) {
      query = query.andWhere(
        '(LOWER(user.fullName) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search))',
        { search: `%${search.trim()}%` },
      );
    }

    // Ordenar por nombre completo
    query = query.orderBy('user.fullName', 'ASC');

    // Obtener el total de registros
    const total = await query.getCount();

    // Aplicar paginación
    const offset = (page - 1) * limit;
    query = query.skip(offset).take(limit);

    // Obtener los usuarios
    const users = await query.getMany();

    // Calcular metadatos de paginación
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      users,
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      this.logger.log(`Buscando usuario por email: ${email}`);
      const user = await this.usersRepository.findOneByOrFail({ email });
      this.logger.log(
        `Usuario encontrado por email: ${email} (ID: ${user.id})`,
      );
      return user;
    } catch (error) {
      this.logger.warn(`Usuario no encontrado con email: ${email}`);
      throw new NotFoundException(`El usuario con este email no existe`);
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      this.logger.log(`Buscando usuario por ID: ${id}`);
      const user = await this.usersRepository.findOneByOrFail({ id });
      this.logger.log(`Usuario encontrado por ID: ${id} (${user.email})`);
      return user;
    } catch (error) {
      this.logger.warn(`Usuario no encontrado con ID: ${id}`);
      throw new NotFoundException(`${id} no encontrado`);
    }
  }

  async block(id: string, adminUser: User): Promise<User> {
    this.logger.log(
      `Intentando bloquear/desbloquear usuario ${id} por admin ${adminUser.fullName}`,
    );

    const userToBlock = await this.findOneById(id);

    // Verificar que el admin puede bloquear/desbloquear este usuario
    if (!this.canManageUser(adminUser, userToBlock)) {
      throw new BadRequestException(
        'No tienes permisos para bloquear/desbloquear este usuario',
      );
    }

    // No permitir que un usuario se bloquee a sí mismo
    if (userToBlock.id === adminUser.id) {
      throw new BadRequestException(
        'No puedes bloquear/desbloquear tu propia cuenta',
      );
    }

    // Alternar el estado activo
    userToBlock.isActive = !userToBlock.isActive;
    userToBlock.lastUpdateBy = adminUser;

    this.logger.log(
      `Usuario ${userToBlock.email} ${userToBlock.isActive ? 'activado' : 'bloqueado'} por ${adminUser.fullName}`,
    );

    return await this.usersRepository.save(userToBlock);
  }

  async updateUserRoles(
    id: string,
    roles: ValidRoles[],
    adminUser: User,
  ): Promise<User> {
    this.logger.log(
      `Actualizando roles del usuario ${id} por admin ${adminUser.fullName}`,
    );

    const userToUpdate = await this.findOneById(id);

    // Verificar que el admin puede cambiar los roles del usuario objetivo
    if (!this.canManageUser(adminUser, userToUpdate)) {
      throw new BadRequestException(
        'No tienes permisos para cambiar los roles de este usuario',
      );
    }

    // Verificar que el admin puede asignar los roles solicitados
    if (!this.canAssignRoles(adminUser, roles)) {
      throw new BadRequestException(
        'No tienes permisos para asignar uno o más de estos roles',
      );
    }

    userToUpdate.roles = roles;
    userToUpdate.lastUpdateBy = adminUser;

    this.logger.log(
      `Roles actualizados para ${userToUpdate.email}: ${roles.join(', ')}`,
    );
    return await this.usersRepository.save(userToUpdate);
  }

  async assignLanguageToUser(
    userId: string,
    languageId: string | undefined,
    adminUser: User,
  ): Promise<User> {
    this.logger.log(
      `Asignando idioma ${languageId} al usuario ${userId} por admin ${adminUser.fullName}`,
    );

    const userToUpdate = await this.findOneById(userId);

    // Verificar que el admin puede gestionar este usuario
    if (!this.canManageUser(adminUser, userToUpdate)) {
      throw new BadRequestException(
        'No tienes permisos para gestionar este usuario',
      );
    }

    // Solo SuperUsers pueden asignar idiomas a admins
    const adminHighestRole = this.getHighestRole(adminUser.roles);
    if (adminHighestRole !== ValidRoles.superUser) {
      throw new BadRequestException(
        'Solo los Super Administradores pueden asignar idiomas a usuarios',
      );
    }

    userToUpdate.assignedLanguageId = languageId;
    userToUpdate.lastUpdateBy = adminUser;

    this.logger.log(
      `Idioma ${languageId ? languageId : 'removido'} asignado a ${userToUpdate.email}`,
    );
    return await this.usersRepository.save(userToUpdate);
  }

  private canManageUser(adminUser: User, targetUser: User): boolean {
    const adminHighestRole = this.getHighestRole(adminUser.roles);
    const targetHighestRole = this.getHighestRole(targetUser.roles);

    const roleHierarchy = {
      superUser: 5,
      admin: 4,
      docente: 3,
      alumno: 2,
      mortal: 1,
    };

    const adminLevel = roleHierarchy[adminHighestRole] || 0;
    const targetLevel = roleHierarchy[targetHighestRole] || 0;

    // Solo puede gestionar usuarios con nivel menor
    return adminLevel > targetLevel;
  }

  private canAssignRoles(
    adminUser: User,
    rolesToAssign: ValidRoles[],
  ): boolean {
    const adminHighestRole = this.getHighestRole(adminUser.roles);

    // Verificar que puede asignar todos los roles solicitados
    for (const role of rolesToAssign) {
      // superUser puede asignar: superUser, admin, docente, alumno, mortal
      if (adminHighestRole === ValidRoles.superUser) {
        if (
          role === ValidRoles.superUser ||
          role === ValidRoles.admin ||
          role === ValidRoles.docente ||
          role === ValidRoles.alumno ||
          role === ValidRoles.mortal
        ) {
          continue;
        }
      }

      // admin puede asignar: docente, alumno, mortal
      if (adminHighestRole === ValidRoles.admin) {
        if (
          role === ValidRoles.docente ||
          role === ValidRoles.alumno ||
          role === ValidRoles.mortal
        ) {
          continue;
        }
      }

      // docente puede asignar: alumno, mortal
      if (adminHighestRole === ValidRoles.docente) {
        if (role === ValidRoles.alumno || role === ValidRoles.mortal) {
          continue;
        }
      }

      // Si llega aquí, no puede asignar este rol
      return false;
    }

    return true;
  }

  private getHighestRole(roles: string[]): ValidRoles {
    const roleHierarchy = {
      superUser: 5,
      admin: 4,
      docente: 3,
      alumno: 2,
      mortal: 1,
    };

    let highestRole = ValidRoles.mortal;
    let highestLevel = 0;

    for (const role of roles) {
      const level = roleHierarchy[role as ValidRoles] || 0;
      if (level > highestLevel) {
        highestLevel = level;
        highestRole = role as ValidRoles;
      }
    }

    return highestRole;
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException('Este correo ya esta en uso');
    }
    if (error.code === 'error-01') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Favor de checar los logs');
  }
}
