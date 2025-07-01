import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLenguageInput } from './dto/create-lenguage.input';
import { UpdateLenguageInput } from './dto/update-lenguage.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Lenguage } from './entities/lenguage.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Injectable()
export class LenguagesService {
  constructor(
    @InjectRepository(Lenguage)
    private readonly lenguageRepository: Repository<Lenguage>,
  ) {}

  create(createLenguageInput: CreateLenguageInput) {
    const newLenguage = this.lenguageRepository.create(createLenguageInput);
    return this.lenguageRepository.save(newLenguage);
  }
  async findActive(user?: User): Promise<Lenguage[]> {
    // Si es un admin con idioma asignado, solo mostrar su idioma
    if (
      user &&
      this.getHighestRole(user.roles) === ValidRoles.admin &&
      user.assignedLanguageId
    ) {
      return await this.lenguageRepository.find({
        where: {
          isActive: true,
          id: user.assignedLanguageId,
        },
      });
    }

    // SuperUsers y otros roles ven todos los idiomas activos
    return await this.lenguageRepository.find({
      where: { isActive: true },
    });
  }

  async findAll(): Promise<Lenguage[]> {
    return await this.lenguageRepository.find();
  }

  async findOne(id: string): Promise<Lenguage> {
    const lenguage = await this.lenguageRepository.findOneBy({ id });
    if (!lenguage) throw new NotFoundException(`Lenguaje no encontrado`);
    return lenguage;
  }

  async update(
    id: string,
    updateLenguageInput: UpdateLenguageInput,
  ): Promise<Lenguage> {
    const lenguage = await this.findOne(id);
    if (updateLenguageInput.name) lenguage.name = updateLenguageInput.name;
    return await this.lenguageRepository.save(lenguage);
  }

  async remove(id: string) {
    const lenguage = await this.findOne(id);
    lenguage.isActive = !lenguage.isActive;
    return await this.lenguageRepository.save(lenguage);
  }

  /**
   * Gets the highest role from user roles array
   */
  private getHighestRole(roles: string[]): ValidRoles {
    const roleHierarchy = {
      [ValidRoles.superUser]: 4,
      [ValidRoles.admin]: 3,
      [ValidRoles.docente]: 2,
      [ValidRoles.alumno]: 1,
    };

    return roles.reduce((highest, role) => {
      const roleLevel = roleHierarchy[role as ValidRoles] || 0;
      const highestLevel = roleHierarchy[highest as ValidRoles] || 0;
      return roleLevel > highestLevel ? (role as ValidRoles) : highest;
    }, ValidRoles.alumno as string) as ValidRoles;
  }
}
