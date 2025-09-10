import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Content } from '../../contents/entities/content.entity';
import { Activity } from '../../activities/entities/activity.entity';

@Entity({ name: 'user_progress' })
@ObjectType()
@Index(['userId', 'contentId'], { unique: true })
export class UserProgress {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => ID)
  userId: string;

  @Column()
  @Field(() => ID)
  contentId: string;

  @Column({ type: 'float', default: 0 })
  @Field(() => Float)
  progressPercentage: number; // Porcentaje de avance general del contenido

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  completedActivities: number; // Número de actividades completadas

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  totalActivities: number; // Total de actividades en el contenido

  @Column({ type: 'json', nullable: true })
  @Field(() => [String], { nullable: true })
  completedActivityIds?: string[]; // IDs de actividades completadas

  @Column({ type: 'json', nullable: true })
  @Field(() => [String], { nullable: true })
  formResponseIds?: string[]; // IDs de respuestas de formularios

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean)
  isCompleted: boolean; // Si el contenido está completamente terminado

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  lastActivityAt?: Date; // Última vez que el usuario realizó una actividad

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  completedAt?: Date; // Fecha de finalización del contenido

  // Relaciones
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  @Field(() => User)
  user: User;

  @ManyToOne(() => Content, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contentId' })
  @Field(() => Content)
  content: Content;

  @CreateDateColumn()
  @Field(() => String)
  createdAt: string;

  @UpdateDateColumn()
  @Field(() => String)
  updatedAt: string;
}