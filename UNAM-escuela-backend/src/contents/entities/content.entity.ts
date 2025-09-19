import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Skill } from '../../skills/entities/skill.entity';
import { Level } from '../../levels/entities/level.entity';
import { Lenguage } from '../../lenguages/entities/lenguage.entity';

@Entity({ name: 'contents' })
@ObjectType()
export class Content {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  description: string;

  @Column({ default: false })
  @Field(() => Boolean)
  isCompleted: boolean;

  @CreateDateColumn()
  @Field(() => String)
  createdAt: string;

  @UpdateDateColumn()
  @Field(() => String)
  updatedAt: string;

  @Column({ nullable: true })
  @Field(() => ID, { nullable: true })
  levelId?: string;

  @Column({ default: -1 })
  @Field(() => Int)
  userId: number;

  // Contenido JSON del editor
  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  jsonContent?: string;

  // Relación muchos a muchos con profesores asignados
  @ManyToMany(() => User, { cascade: true })
  @JoinTable({
    name: 'content_teachers',
    joinColumn: { name: 'contentId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'teacherId', referencedColumnName: 'id' },
  })
  @Field(() => [User], { nullable: true })
  assignedTeachers?: User[];

  // Estado de validación del contenido
  @Column({ default: 'sin validar' })
  @Field(() => String)
  validationStatus: string; // sin validar, validado

  // Fecha de publicación
  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  publishedAt?: string;

  // Tiempo total calculado basado en las actividades relacionadas (en minutos)
  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  calculatedTotalTime?: number;

  @Column({ nullable: true })
  @Field(() => ID, { nullable: true })
  skillId?: string;

  // Relación con Skill
  @ManyToOne(() => Skill, { nullable: true })
  @JoinColumn({ name: 'skillId' })
  @Field(() => Skill, { nullable: true })
  skill?: Skill;

  @ManyToOne(() => Level, { nullable: true })
  @JoinColumn({ name: 'levelId' })
  @Field(() => Level, { nullable: true })
  level?: Level;

  @Column({ nullable: true, default: null })
  @Field(() => ID, { nullable: true })
  languageId?: string;

  @ManyToOne(() => Lenguage, { nullable: true })
  @JoinColumn({ name: 'languageId' })
  @Field(() => Lenguage, { nullable: true })
  language?: Lenguage;
}
