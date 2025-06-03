import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'lenguages' })
@ObjectType()
export class Lenguage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @CreateDateColumn()
  @Field(() => String)
  createdAt: string;

  @UpdateDateColumn()
  @Field(() => String)
  updatedAt: string;

  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean, { defaultValue: true })
  isActive: boolean;
}
