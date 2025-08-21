import { 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsArray, 
  IsEnum, 
  IsInt, 
  Min, 
  Max, 
  IsBoolean,
  MaxLength,
  IsHexColor,
  IsNumber,
  ValidateIf
} from 'class-validator';
import { CreateLenguageInput } from './create-lenguage.input';
import { InputType, Field, Int, PartialType, ID, Float } from '@nestjs/graphql';
import { NivelEnum, BadgeEnum, EstadoEnum } from '../entities/lenguage.entity';

@InputType()
export class UpdateLenguageInput extends PartialType(CreateLenguageInput) {
  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  id: string;

  @IsOptional()
  @ValidateIf((o) => o.name !== undefined && o.name !== null)
  @IsString({ message: 'El nombre debe ser un texto válido' })
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @ValidateIf((o) => o.eslogan_atractivo !== undefined && o.eslogan_atractivo !== null)
  @IsString({ message: 'El eslogan atractivo debe ser un texto válido' })
  @Field(() => String, { nullable: true })
  eslogan_atractivo?: string;

  @IsOptional()
  @ValidateIf((o) => o.descripcion_corta !== undefined && o.descripcion_corta !== null)
  @IsString({ message: 'La descripción corta debe ser un texto válido' })
  @MaxLength(100, { message: 'La descripción corta no puede exceder 100 caracteres' })
  @Field(() => String, { nullable: true })
  descripcion_corta?: string;

  @IsOptional()
  @ValidateIf((o) => o.descripcion_completa !== undefined && o.descripcion_completa !== null)
  @IsString({ message: 'La descripción completa debe ser un texto válido' })
  @Field(() => String, { nullable: true })
  descripcion_completa?: string;

  @IsOptional()
  @IsEnum(NivelEnum)
  @Field(() => String, { nullable: true })
  nivel?: NivelEnum;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'La duración debe ser al menos 1 hora' })
  @Field(() => Int, { nullable: true })
  duracion_total_horas?: number;

  @IsOptional()
  @ValidateIf((o) => o.color_tema !== undefined && o.color_tema !== null)
  @IsString({ message: 'El color tema debe ser un texto válido' })
  @Field(() => String, { nullable: true })
  color_tema?: string;

  @IsOptional()
  @ValidateIf((o) => o.icono_curso !== undefined && o.icono_curso !== null)
  @IsString({ message: 'El icono del curso debe ser un texto válido' })
  @Field(() => String, { nullable: true })
  icono_curso?: string;

  @IsOptional()
  @ValidateIf((o) => o.imagen_hero !== undefined && o.imagen_hero !== null)
  @IsString({ message: 'La imagen hero debe ser un texto válido' })
  @Field(() => String, { nullable: true })
  imagen_hero?: string;

  @IsOptional()
  @IsEnum(BadgeEnum)
  @Field(() => String, { nullable: true })
  badge_destacado?: BadgeEnum;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'La dificultad debe ser entre 1 y 5' })
  @Max(5, { message: 'La dificultad debe ser entre 1 y 5' })
  @Field(() => Int, { nullable: true })
  dificultad?: number;

  @IsOptional()
  @ValidateIf((o) => o.idioma_origen !== undefined && o.idioma_origen !== null)
  @IsString({ message: 'El idioma origen debe ser un texto válido' })
  @Field(() => String, { nullable: true })
  idioma_origen?: string;

  @IsOptional()
  @ValidateIf((o) => o.idioma_destino !== undefined && o.idioma_destino !== null)
  @IsString({ message: 'El idioma destino debe ser un texto válido' })
  @Field(() => String, { nullable: true })
  idioma_destino?: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  certificado_digital?: boolean;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(5)
  @Field(() => Float, { nullable: true })
  puntuacion_promedio?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Field(() => Int, { nullable: true })
  total_estudiantes_inscritos?: number;

  @IsOptional()
  @IsEnum(EstadoEnum)
  @Field(() => String, { nullable: true })
  estado?: EstadoEnum;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  featured?: boolean;

  // Campos legacy para compatibilidad
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Field(() => [String], { nullable: true })
  icons?: string[];
}
