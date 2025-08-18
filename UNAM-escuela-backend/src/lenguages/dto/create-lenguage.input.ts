import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { 
  IsNotEmpty, 
  IsString, 
  IsArray, 
  ArrayMinSize, 
  IsEnum, 
  IsInt, 
  Min, 
  Max, 
  IsBoolean, 
  IsOptional,
  MaxLength,
  IsHexColor,
  IsNumber
} from 'class-validator';
import { NivelEnum, BadgeEnum, EstadoEnum } from '../entities/lenguage.entity';

@InputType()
export class CreateLenguageInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  name: string;

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
  @IsString()
  @Field(() => String, { nullable: true })
  idioma_origen?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  idioma_destino?: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { defaultValue: false })
  certificado_digital?: boolean;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(5)
  @Field(() => Float, { defaultValue: 0 })
  puntuacion_promedio?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Field(() => Int, { defaultValue: 0 })
  total_estudiantes_inscritos?: number;

  @IsOptional()
  @IsEnum(EstadoEnum)
  @Field(() => String, { defaultValue: EstadoEnum.ACTIVO })
  estado?: EstadoEnum;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { defaultValue: false })
  featured?: boolean;

  // Campos legacy para compatibilidad
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Field(() => [String], { nullable: true })
  icons?: string[];
}
