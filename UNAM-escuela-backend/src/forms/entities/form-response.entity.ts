import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Form } from './form.entity';
import { User } from '../../users/entities/user.entity';
import { FormAnswer } from './form-answer.entity';

@Entity({ name: 'form_responses' })
@ObjectType()
export class FormResponse {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  respondentName?: string; // para respuestas anónimas

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  respondentEmail?: string; // para respuestas anónimas

  @Column({ default: false })
  @Field(() => Boolean)
  isAnonymous: boolean;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  userAgent?: string;

  @Column({ default: 'completed' }) // 'draft', 'completed', 'abandoned'
  @Field(() => String)
  status: string;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  startedAt?: Date;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  completedAt?: Date;

  // Relaciones
  @Column()
  @Field(() => ID)
  formId: string;

  @ManyToOne(() => Form, (form) => form.responses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'formId' })
  @Field(() => Form)
  form: Form;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  userId?: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'userId' })
  @Field(() => User, { nullable: true })
  user?: User;

  @OneToMany(() => FormAnswer, (answer) => answer.response, { cascade: true })
  @Field(() => [FormAnswer])
  answers: FormAnswer[];

  @CreateDateColumn()
  @Field(() => String)
  createdAt: string;

  @UpdateDateColumn()
  @Field(() => String)
  updatedAt: string;
}