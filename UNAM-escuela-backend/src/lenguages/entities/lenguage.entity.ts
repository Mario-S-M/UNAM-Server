import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum NivelEnum {
  BASICO = 'Básico',
  BASICO_INTERMEDIO = 'Básico-Intermedio',
  INTERMEDIO = 'Intermedio',
  INTERMEDIO_AVANZADO = 'Intermedio-Avanzado',
  AVANZADO = 'Avanzado',
}

export enum BadgeEnum {
  MAS_POPULAR = 'Más Popular',
  NUEVO = 'Nuevo',
  RECOMENDADO = 'Recomendado',
}

export enum EstadoEnum {
  ACTIVO = 'Activo',
  INACTIVO = 'Inactivo',
  EN_DESARROLLO = 'En Desarrollo',
  PAUSADO = 'Pausado',
}

@Entity({ name: 'lenguages' })
@ObjectType()
export class Lenguage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  eslogan_atractivo?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Field(() => String, { nullable: true })
  descripcion_corta?: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  descripcion_completa?: string;

  @Column({ type: 'enum', enum: NivelEnum, nullable: true })
  @Field(() => String, { nullable: true })
  nivel?: NivelEnum;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  duracion_total_horas?: number;

  @Column({ type: 'varchar', length: 7, nullable: true })
  @Field(() => String, { nullable: true })
  color_tema?: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  icono_curso?: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  imagen_hero?: string;

  @Column({ type: 'enum', enum: BadgeEnum, nullable: true })
  @Field(() => String, { nullable: true })
  badge_destacado?: BadgeEnum;



  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  idioma_origen?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  idioma_destino?: string;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean)
  certificado_digital: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  @Field(() => Float)
  puntuacion_promedio: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  total_estudiantes_inscritos: number;

  @Column({ type: 'enum', enum: EstadoEnum, default: EstadoEnum.ACTIVO })
  @Field(() => String)
  estado: EstadoEnum;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean)
  featured: boolean;

  @CreateDateColumn()
  @Field(() => String)
  fecha_creacion: string;

  @UpdateDateColumn()
  @Field(() => String)
  fecha_actualizacion: string;

  // Campos legacy para compatibilidad
  @Column('simple-array', { nullable: true })
  @Field(() => [String], { nullable: true })
  icons?: string[];

  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean, { defaultValue: true })
  isActive: boolean;

  @CreateDateColumn()
  @Field(() => String)
  createdAt: string;

  @UpdateDateColumn()
  @Field(() => String)
  updatedAt: string;
}
