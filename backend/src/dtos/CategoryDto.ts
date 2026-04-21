import {
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
} from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(2)
  description!: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsString()
  @MinLength(2)
  color!: string;

  @IsNumber()
  spaceId!: number;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  color?: string;
}
