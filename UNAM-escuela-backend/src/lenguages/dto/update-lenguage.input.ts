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
  IsNumber
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
  @IsString()
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  eslogan_atractivo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'La descripción corta no puede exceder 100 caracteres' })
  @Field(() => String, { nullable: true })
  descripcion_corta?: string;

  @IsOptional()
  @IsString()
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
  @IsString()
  @IsHexColor({ message: 'El color debe ser un código hexadecimal válido' })
  @Field(() => String, { nullable: true })
  color_tema?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  icono_curso?: string;

  @IsOptional()
  @IsString()
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
  @IsString()
  @Field(() => String, { nullable: true })
  idioma_origen?: string;

  @IsOptional()
  @IsString()
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
