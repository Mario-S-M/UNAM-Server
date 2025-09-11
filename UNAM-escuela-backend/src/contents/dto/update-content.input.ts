import { IsNotEmpty, IsOptional, IsString, IsArray, IsEnum, ArrayMinSize, IsUUID } from 'class-validator';
import { CreateContentInput } from './create-content.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

enum ValidationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED', 
  REJECTED = 'REJECTED'
}

@InputType()
export class UpdateContentInput extends PartialType(CreateContentInput) {
  @IsNotEmpty({ message: 'El ID es requerido y debe ser un texto' })
  @IsString({ message: 'El ID es requerido y debe ser un texto' })
  @IsUUID('4', { message: 'El ID debe ser un UUID válido' })
  @Field(() => ID)
  id: string;

  @IsString({ message: 'El nombre debe ser un texto' })
  @IsOptional()
  @Field(() => String, { nullable: true })
  name?: string;

  @IsString({ message: 'La descripción debe ser un texto' })
  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsOptional()
  @IsArray({ message: 'Los IDs de profesores deben ser un array' })
  @ArrayMinSize(1, { message: 'Debe asignar al menos un profesor' })
  @IsUUID('4', { each: true, message: 'Cada ID de profesor debe ser un UUID válido' })
  @Field(() => [ID], { nullable: true })
  teacherIds?: string[];

  @IsOptional()
  @IsEnum(ValidationStatus, { message: 'El estado de validación debe ser PENDING, APPROVED o REJECTED' })
  @Field(() => String, { nullable: true })
  validationStatus?: ValidationStatus;

  @IsOptional()
  @IsString({ message: 'El ID de la habilidad debe ser un texto' })
  @IsUUID('4', { message: 'El ID de la habilidad debe ser un UUID válido' })
  @Field(() => ID, { nullable: true })
  skillId?: string;

  @IsOptional()
  @IsString({ message: 'El ID del nivel debe ser un texto' })
  @IsUUID('4', { message: 'El ID del nivel debe ser un UUID válido' })
  @Field(() => ID, { nullable: true })
  levelId?: string;

  @IsOptional()
  @IsString({ message: 'El ID del idioma debe ser un texto' })
  @IsUUID('4', { message: 'El ID del idioma debe ser un UUID válido' })
  @Field(() => ID, { nullable: true })
  languageId?: string;
}
