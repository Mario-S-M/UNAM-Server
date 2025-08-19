import { InputType, Field, Int, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, Matches, IsUrl, IsInt, Min, IsArray, IsIn, IsUUID } from 'class-validator';
import { IsOptionalUUID } from '../../common/validators/optional-uuid.validator';

@InputType()
export class CreateSkillInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  description: string;

  @IsOptional()
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Color debe ser un valor hexadecimal válido',
  })
  @Field(() => String, { nullable: true })
  color?: string;

  @IsOptional()
  @IsUrl({}, { message: 'La URL de la imagen debe ser válida' })
  @Field(() => String, { nullable: true })
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  icon?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  objectives?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  prerequisites?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Básico', 'Intermedio', 'Avanzado'], {
    message: 'La dificultad debe ser: Básico, Intermedio o Avanzado',
  })
  @Field(() => String, { nullable: true })
  difficulty?: string;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Las horas estimadas deben ser al menos 1' })
  @Field(() => Int, { nullable: true })
  estimatedHours?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Field(() => [String], { nullable: true })
  tags?: string[];

  @IsOptionalUUID('4', { message: 'El ID del nivel debe ser un UUID válido o null' })
  @Field(() => ID, { nullable: true })
  levelId?: string | null; // ID del nivel al que pertenece esta skill

  @IsOptionalUUID('4', { message: 'El ID del idioma debe ser un UUID válido o null' })
  @Field(() => ID, { nullable: true })
  lenguageId?: string | null; // ID del idioma al que pertenece esta skill
}
