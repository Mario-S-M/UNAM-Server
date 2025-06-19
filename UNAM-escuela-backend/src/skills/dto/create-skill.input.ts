import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, Matches } from 'class-validator';

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
}
