import {
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
  IsBoolean,
} from "class-validator";

export class CreateListDto {
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

  @IsBoolean()
  isPublic!: boolean;

  @IsNumber()
  categoryId!: number;
}

export class UpdateListDto {
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

  @IsOptional()
  @IsBoolean()
  isPublic!: boolean;
}
