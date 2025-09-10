import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FormQuestion } from './form-question.entity';
import { FormResponse } from './form-response.entity';
import { FormQuestionOption } from './form-question-option.entity';

@Entity({ name: 'form_answers' })
@ObjectType()
export class FormAnswer {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ nullable: true, type: 'text' })
  @Field(() => String, { nullable: true })
  textAnswer?: string; // para respuestas de texto

  @Column({ nullable: true, type: 'json' })
  @Field(() => [String], { nullable: true })
  selectedOptionIds?: string[]; // para opciones múltiples

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  numericAnswer?: string; // para escalas de valoración

  @Column({ nullable: true })
  @Field(() => Boolean, { nullable: true })
  booleanAnswer?: boolean; // para preguntas sí/no

  // Relaciones
  @Column()
  @Field(() => ID)
  questionId: string;

  @ManyToOne(() => FormQuestion, (question) => question.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionId' })
  @Field(() => FormQuestion)
  question: FormQuestion;

  @Column()
  @Field(() => ID)
  responseId: string;

  @ManyToOne(() => FormResponse, (response) => response.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'responseId' })
  @Field(() => FormResponse)
  response: FormResponse;

  @CreateDateColumn()
  @Field(() => String)
  createdAt: string;

  @UpdateDateColumn()
  @Field(() => String)
  updatedAt: string;
}