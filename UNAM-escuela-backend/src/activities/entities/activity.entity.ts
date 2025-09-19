import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Form } from '../../forms/entities/form.entity';

@Entity({ name: 'activities' })
@ObjectType()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => String)
  indication: string;
  
  @Column()
  @Field(() => String)
  example: string;

  @Column()
  @Field(() => ID)
  contentId: string;

  @CreateDateColumn()
  @Field(() => String)
  createdAt: string;

  @UpdateDateColumn()
  @Field(() => String)
  updatedAt: string;

  @Column({ default: -1 })
  @Field(() => Int)
  userId: number;

  @Column({ nullable: true })
  @Field(() => ID, { nullable: true })
  formId?: string;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  estimatedTime?: number; // Tiempo estimado en minutos para completar la actividad

  @OneToOne(() => Form, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'formId' })
  @Field(() => Form, { nullable: true })
  form?: Form;
}
