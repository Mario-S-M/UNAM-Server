import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Level } from '../../levels/entities/level.entity';
import { Lenguage } from '../../lenguages/entities/lenguage.entity';

@Entity({ name: 'skills' })
@ObjectType()
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  description: string;

  @Column({ default: '#3B82F6' })
  @Field(() => String)
  color: string; // Color hex para identificar visualmente la skill

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  imageUrl?: string; // URL de la imagen representativa de la skill

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  icon?: string; // Icono de la skill (nombre del icono de Lucide React)

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  objectives?: string; // Objetivos de aprendizaje de la skill

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  prerequisites?: string; // Conocimientos previos necesarios

  @Column({ default: 'Básico' })
  @Field(() => String)
  difficulty: string; // Nivel de dificultad: Básico, Intermedio, Avanzado

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  estimatedHours?: number; // Horas estimadas para dominar la skill

  @Column({ type: 'text', array: true, default: '{}' })
  @Field(() => [String])
  tags: string[]; // Etiquetas para categorizar la skill

  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean)
  isActive: boolean;

  @Column({ nullable: true })
  @Field(() => ID, { nullable: true })
  levelId?: string | null; // ID del nivel al que pertenece esta skill

  @ManyToOne(() => Level)
  @JoinColumn({ name: 'levelId' })
  @Field(() => Level, { nullable: true })
  level?: Level; // Relación con el nivel

  @Column({ nullable: true })
  @Field(() => ID, { nullable: true })
  lenguageId?: string | null; // ID del idioma al que pertenece esta skill

  @ManyToOne(() => Lenguage)
  @JoinColumn({ name: 'lenguageId' })
  @Field(() => Lenguage, { nullable: true })
  lenguage?: Lenguage; // Relación con el idioma

  @CreateDateColumn()
  @Field(() => String)
  createdAt: string;

  @UpdateDateColumn()
  @Field(() => String)
  updatedAt: string;
}
