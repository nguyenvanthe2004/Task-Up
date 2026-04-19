import {
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
  IsNumber,
} from "class-validator";

export class CreateSpaceDto {
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
  workspaceId!: number;
}

export class UpdateSpaceDto {
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
