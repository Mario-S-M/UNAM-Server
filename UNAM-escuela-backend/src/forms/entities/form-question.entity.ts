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
import { FormQuestionOption } from './form-question-option.entity';
import { FormAnswer } from './form-answer.entity';

@Entity({ name: 'form_questions' })
@ObjectType()
export class FormQuestion {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  questionText: string;

  @Column() // 'MULTIPLE_CHOICE', 'SINGLE_CHOICE', 'OPEN_TEXT', 'YES_NO', 'WORD_SEARCH'
  @Field(() => String)
  questionType: string;

  @Column({ default: 0 })
  @Field(() => Int)
  orderIndex: number;

  @Column({ default: false })
  @Field(() => Boolean)
  isRequired: boolean;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  description?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  placeholder?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  audioUrl?: string;

  // Para escalas de valoración
  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  minValue?: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  maxValue?: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  minLabel?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  maxLabel?: string;

  // Para preguntas de texto
  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  maxLength?: number;

  @Column({ default: false })
  @Field(() => Boolean)
  allowMultiline: boolean;

  // Campos para respuestas correctas y retroalimentación
  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  correctAnswer?: string; // Respuesta correcta para preguntas de texto

  @Column({ type: 'json', nullable: true })
  @Field(() => [String], { nullable: true })
  correctOptionIds?: string[]; // IDs de opciones correctas para preguntas de opción múltiple

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  explanation?: string; // Explicación o retroalimentación de la respuesta correcta

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  incorrectFeedback?: string; // Retroalimentación para respuestas incorrectas

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  @Field(() => Number, { nullable: true })
  points?: number; // Puntos que vale la pregunta

  // Relaciones
  @Column()
  @Field(() => ID)
  formId: string;

  @ManyToOne(() => Form, (form) => form.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'formId' })
  @Field(() => Form)
  form: Form;

  @OneToMany(() => FormQuestionOption, (option: FormQuestionOption) => option.question, { cascade: true })
  @Field(() => [FormQuestionOption])
  options: FormQuestionOption[];

  @OneToMany(() => FormAnswer, (answer: FormAnswer) => answer.question)
  @Field(() => [FormAnswer])
  answers: FormAnswer[];

  @CreateDateColumn()
  @Field(() => String)
  createdAt: string;

  @UpdateDateColumn()
  @Field(() => String)
  updatedAt: string;
}