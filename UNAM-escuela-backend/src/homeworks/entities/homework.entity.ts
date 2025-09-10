import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';

@Entity({ name: 'homeworks' })
@ObjectType()
export class Homework {
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
  correctAnswer: string;
  
  @Column()
  @Field(() => ID)
  activityId: string;

  @CreateDateColumn()
  @Field(() => String)
  createdAt: string;

  @UpdateDateColumn()
  @Field(() => String)
  updatedAt: string;

  @Column({ default: -1 })
  @Field(() => Int)
  userId: number;
}
