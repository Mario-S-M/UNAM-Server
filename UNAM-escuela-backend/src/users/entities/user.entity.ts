import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lenguage } from 'src/lenguages/entities/lenguage.entity';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  fullName: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
  password: string;

  @Column({ type: 'text', array: true, default: ['alumno'] })
  @Field(() => [String])
  roles: string[];

  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean)
  isActive: boolean;

  // Campo para asignar idioma específico a usuarios admin
  @Column({ nullable: true })
  @Field(() => ID, { nullable: true })
  assignedLanguageId?: string;

  // Relación con el idioma asignado
  @ManyToOne(() => Lenguage, { nullable: true })
  @JoinColumn({ name: 'assignedLanguageId' })
  @Field(() => Lenguage, { nullable: true })
  assignedLanguage?: Lenguage;

  @ManyToOne(() => User, (user) => user.lastUpdateBy, { nullable: true })
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field(() => User, { nullable: true })
  lastUpdateBy?: User;
}
