import {
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
  IsBoolean,
} from "class-validator";

export class CreateStatusDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(2)
  color!: string;

  @IsNumber()
  position!: number;

  @IsNumber()
  spaceId!: number;

}

export class UpdateStatusDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  color?: string;

  @IsOptional()
  @IsNumber()
  position!: number;
}
