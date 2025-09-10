import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
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

@Entity({ name: 'form_question_options' })
@ObjectType()
export class FormQuestionOption {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  optionText: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  optionValue?: string; // valor interno de la opción

  @Column({ default: 0 })
  @Field(() => Int)
  orderIndex: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  color?: string; // para personalización visual

  @Column({ default: false })
  @Field(() => Boolean)
  isCorrect: boolean; // indica si esta opción es la respuesta correcta

  // Relaciones
  @Column()
  @Field(() => ID)
  questionId: string;

  @ManyToOne(() => FormQuestion, (question) => question.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionId' })
  @Field(() => FormQuestion)
  question: FormQuestion;

  @CreateDateColumn()
  @Field(() => String)
  createdAt: string;

  @UpdateDateColumn()
  @Field(() => String)
  updatedAt: string;
}