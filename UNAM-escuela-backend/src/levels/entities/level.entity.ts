import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'levels' })
@ObjectType()
export class Level {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  description: string;

  @Column({ default: false })
  @Field(() => Boolean)
  isCompleted: boolean;

  @Column({ default: 0 })
  @Field(() => Int)
  percentaje: number;

  @Column({ default: 0 })
  @Field(() => Int)
  qualification: number;

  @CreateDateColumn()
  @Field(() => String)
  createdAt: string;

  @UpdateDateColumn()
  @Field(() => String)
  updatedAt: string;
  @Column({ default: -1 })
  @Field(() => Int)
  userId: number;

  @Column({ default: true })
  @Field(() => Boolean)
  isActive: boolean;
}
