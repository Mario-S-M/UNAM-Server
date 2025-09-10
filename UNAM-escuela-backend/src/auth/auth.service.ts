import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { LoginInput, SignupInput } from './dto/inputs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    try {
      this.logger.log(`Intento de registro para email: ${signupInput.email}`);
      const user = await this.usersService.create(signupInput);
      const token = this.getJwtToken(user.id);
      this.logger.log(
        `Registro exitoso para usuario: ${user.email} (ID: ${user.id})`,
      );
      return { token, user };
    } catch (error) {
      this.logger.error(
        `Error en registro para email: ${signupInput.email} - ${error.message}`,
      );
      throw error;
    }
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    try {
      const { email, password } = loginInput;
      this.logger.log(`Intento de login para email: ${email}`);

      const user = await this.usersService.findOneByEmail(email);
      if (!bcrypt.compareSync(password, user.password)) {
        this.logger.warn(`Credenciales incorrectas para email: ${email}`);
        throw new Error('Email o password no es correcto');
      }

      // Verificar si el usuario está activo antes de permitir login
      if (!user.isActive) {
        this.logger.warn(
          `Usuario bloqueado intentó hacer login: ${user.email} (ID: ${user.id})`,
        );
        throw new UnauthorizedException(
          'Esta cuenta está suspendida temporalmente. Contáctese con un administrador para más detalles.',
        );
      }

      const token = this.getJwtToken(user.id);
      this.logger.log(
        `Login exitoso para usuario: ${user.email} (ID: ${user.id}) - Roles: ${user.roles.join(', ')}`,
      );
      return { token, user };
    } catch (error) {
      this.logger.error(
        `Error en login para email: ${loginInput.email} - ${error.message}`,
      );
      throw error;
    }
  }

  async validateUser(id: string): Promise<User> {
    try {
      this.logger.log(`Validando usuario con ID: ${id}`);
      const user = await this.usersService.findOneById(id);
      if (!user.isActive) {
        this.logger.warn(
          `Usuario inactivo intentó acceder: ${user.email} (ID: ${id})`,
        );
        throw new UnauthorizedException(
          'Esta cuenta está suspendida temporalmente. Contáctese con un administrador para más detalles.',
        );
      }
      delete (user as any).password;
      this.logger.log(
        `Usuario validado exitosamente: ${user.email} (ID: ${id})`,
      );
      return user;
    } catch (error) {
      this.logger.error(`Error validando usuario ID: ${id} - ${error.message}`);
      throw error;
    }
  }

  revalidateToken(user: User | null): AuthResponse {
    if (!user) {
      this.logger.log('Intento de revalidación sin usuario autenticado');
      throw new UnauthorizedException('Usuario no autenticado, por favor inicie sesión');
    }
    
    this.logger.log(
      `Revalidando token para usuario: ${user.email} (ID: ${user.id})`,
    );
    const token = this.getJwtToken(user.id);
    return { token, user };
  }

  async revalidateTokenFromString(token?: string): Promise<AuthResponse> {
    if (!token) {
      this.logger.log('Intento de revalidación sin token');
      throw new UnauthorizedException('Usuario no autenticado, por favor inicie sesión');
    }

    try {
      // Remover 'Bearer ' si está presente
      const cleanToken = token.replace('Bearer ', '');
      
      // Verificar y decodificar el token
      const payload = this.jwtService.verify(cleanToken);
      
      // Obtener el usuario usando el ID del token
      const user = await this.validateUser(payload.id);
      
      this.logger.log(
        `Revalidando token para usuario: ${user.email} (ID: ${user.id})`,
      );
      
      // Generar un nuevo token
      const newToken = this.getJwtToken(user.id);
      return { token: newToken, user };
    } catch (error) {
      this.logger.error(`Error revalidando token: ${error.message}`);
      throw new UnauthorizedException('Token inválido o expirado, por favor inicie sesión nuevamente');
    }
  }
}
