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
        roles: ['alumno'], // Asignar automáticamente el rol de alumno
      });
      const savedUser = await this.usersRepository.save(newUser);
      this.logger.log(
        `Usuario creado exitosamente: ${savedUser.email} (ID: ${savedUser.id}) con rol de alumno`,
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
    const userToBLock = await this.findOneById(id);
    userToBLock.isActive = false;
    userToBLock.lastUpdateBy = adminUser;
    return await this.usersRepository.save(userToBLock);
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
