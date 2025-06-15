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
        throw new UnauthorizedException('Usuario no activo');
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

  revalidateToken(user: User): AuthResponse {
    this.logger.log(
      `Revalidando token para usuario: ${user.email} (ID: ${user.id})`,
    );
    const token = this.getJwtToken(user.id);
    return { token, user };
  }
}
