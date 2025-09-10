import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Content } from '../../contents/entities/content.entity';
import { Activity } from '../../activities/entities/activity.entity';
import { FormResponse } from '../../forms/entities/form-response.entity';

@Entity({ name: 'user_activity_history' })
@ObjectType()
export class UserActivityHistory {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => ID)
  userId: string;

  @Column()
  @Field(() => ID)
  contentId: string;

  @Column()
  @Field(() => ID)
  activityId: string;

  @Column({ nullable: true })
  @Field(() => ID, { nullable: true })
  formResponseId?: string;

  @Column({ default: 'completed' }) // 'started', 'in_progress', 'completed', 'abandoned'
  @Field(() => String)
  status: string;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  score?: number; // Puntuación obtenida

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  maxScore?: number; // Puntuación máxima posible

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  timeSpent?: number; // Tiempo empleado en segundos

  @Column({ type: 'int', default: 1 })
  @Field(() => Int)
  attemptNumber: number; // Número de intento

  @Column({ type: 'json', nullable: true })
  @Field(() => [String], { nullable: true })
  answeredQuestionIds?: string[]; // IDs de preguntas respondidas

  @Column({ type: 'json', nullable: true })
  @Field(() => [String], { nullable: true })
  correctAnswerIds?: string[]; // IDs de preguntas respondidas correctamente

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  startedAt?: Date;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  completedAt?: Date;

  // Relaciones
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  @Field(() => User)
  user: User;

  @ManyToOne(() => Content, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contentId' })
  @Field(() => Content)
  content: Content;

  @ManyToOne(() => Activity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'activityId' })
  @Field(() => Activity)
  activity: Activity;

  @ManyToOne(() => FormResponse, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'formResponseId' })
  @Field(() => FormResponse, { nullable: true })
  formResponse?: FormResponse;

  @CreateDateColumn()
  @Field(() => String)
  createdAt: string;

  @UpdateDateColumn()
  @Field(() => String)
  updatedAt: string;
}