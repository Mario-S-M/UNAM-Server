import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Content } from './content.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'plate_comments' })
@ObjectType()
export class PlateComment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'text' })
  @Field(() => String)
  comment: string;

  @Column({ type: 'json', nullable: true })
  @Field(() => String, { nullable: true })
  commentRich: string; // JSON string of PlateJS rich content

  @Column()
  @Field(() => ID)
  contentId: string;

  @Column()
  @Field(() => ID)
  userId: string;

  @Column({ type: 'json', nullable: true })
  @Field(() => String, { nullable: true })
  textSelection: string; // JSON string with text selection info

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  selectedText: string; // The actual selected text for reference

  @Column({ type: 'json', nullable: true })
  @Field(() => String, { nullable: true })
  position: string; // JSON string with position information (path, offset, etc.)

  @Column({ default: false })
  @Field(() => Boolean)
  isResolved: boolean;

  @Column({ default: false })
  @Field(() => Boolean)
  isEdited: boolean;

  @CreateDateColumn()
  @Field(() => String)
  createdAt: string;

  @UpdateDateColumn()
  @Field(() => String)
  updatedAt: string;

  // Relaciones
  @ManyToOne(() => Content, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contentId' })
  @Field(() => Content)
  content: Content;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  @Field(() => User)
  user: User;
}