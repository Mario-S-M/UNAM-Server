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
import { Content } from '../../contents/entities/content.entity';
import { User } from '../../users/entities/user.entity';
import { FormQuestion } from './form-question.entity';
import { FormResponse } from './form-response.entity';

@Entity({ name: 'forms' })
@ObjectType()
export class Form {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  description?: string;

  @Column({ default: 'draft' }) // 'draft', 'published', 'archived'
  @Field(() => String)
  status: string;

  @Column({ default: false })
  @Field(() => Boolean)
  allowAnonymous: boolean;

  @Column({ default: false })
  @Field(() => Boolean)
  allowMultipleResponses: boolean;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  successMessage?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  backgroundColor?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  textColor?: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  fontFamily?: string;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  publishedAt?: Date;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  closedAt?: Date;

  // Relaciones
  @Column()
  @Field(() => ID)
  contentId: string;

  @ManyToOne(() => Content, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contentId' })
  @Field(() => Content)
  content: Content;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  userId?: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'userId' })
  @Field(() => User, { nullable: true })
  user?: User;

  @OneToMany(() => FormQuestion, (question) => question.form, { cascade: true })
  @Field(() => [FormQuestion])
  questions: FormQuestion[];

  @OneToMany(() => FormResponse, (response) => response.form)
  @Field(() => [FormResponse])
  responses: FormResponse[];

  @CreateDateColumn()
  @Field(() => String)
  createdAt: string;

  @UpdateDateColumn()
  @Field(() => String)
  updatedAt: string;
}