import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsArray, IsOptional, IsEnum, ArrayMinSize, IsUUID } from 'class-validator';

enum ValidationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED', 
  REJECTED = 'REJECTED'
}

@InputType()
export class CreateContentInput {
  @IsNotEmpty({ message: 'El nombre es requerido y debe ser un texto' })
  @IsString({ message: 'El nombre es requerido y debe ser un texto' })
  @Field(() => String)
  name: string;

  @IsNotEmpty({ message: 'La descripción es requerida y debe ser un texto' })
  @IsString({ message: 'La descripción es requerida y debe ser un texto' })
  @Field(() => String)
  description: string;

  @IsNotEmpty({ message: 'El ID del nivel es requerido y debe ser un texto' })
  @IsString({ message: 'El ID del nivel es requerido y debe ser un texto' })
  @IsUUID('4', { message: 'El ID del nivel debe ser un UUID válido' })
  @Field(() => ID)
  levelId: string;

  @IsNotEmpty({ message: 'El ID de la habilidad es requerido y debe ser un texto' })
  @IsString({ message: 'El ID de la habilidad es requerido y debe ser un texto' })
  @IsUUID('4', { message: 'El ID de la habilidad debe ser un UUID válido' })
  @Field(() => ID)
  skillId: string;

  @IsArray({ message: 'Los IDs de profesores deben ser un array' })
  @ArrayMinSize(1, { message: 'Debe asignar al menos un profesor' })
  @IsUUID('4', { each: true, message: 'Cada ID de profesor debe ser un UUID válido' })
  @Field(() => [ID])
  teacherIds: string[];

  @IsEnum(ValidationStatus, { message: 'El estado de validación debe ser PENDING, APPROVED o REJECTED' })
  @Field(() => String)
  validationStatus: ValidationStatus;

  @IsOptional()
  @IsString({ message: 'El ID del idioma debe ser un texto' })
  @IsUUID('4', { message: 'El ID del idioma debe ser un UUID válido' })
  @Field(() => ID, { nullable: true })
  languageId?: string;

  @IsOptional()
  @IsString({ message: 'Los objetivos deben ser un texto' })
  @Field(() => String, { nullable: true })
  objectives?: string;

  @IsOptional()
  @IsString({ message: 'Los prerequisitos deben ser un texto' })
  @Field(() => String, { nullable: true })
  prerequisites?: string;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  estimatedHours?: number;

  @IsOptional()
  @IsArray({ message: 'Las etiquetas deben ser un array' })
  @Field(() => [String], { nullable: true })
  tags?: string[];

  @IsOptional()
  @IsString({ message: 'La dificultad debe ser un texto' })
  @Field(() => String, { nullable: true })
  difficulty?: string;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}
