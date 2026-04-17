import { IsString, MinLength } from "class-validator";

export class CreateWorkspaceDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(2)
  description!: string;

  @IsString()
  @MinLength(2)
  icon!: string;

  @IsString()
  @MinLength(2)
  color!: string;
}

export class UpdateWorkspaceDto {
  @IsString()
  @MinLength(2)
  name!: string;


  @IsString()
  @MinLength(2)
  description!: string;

    @IsString()
  @MinLength(2)
  icon!: string;

  @IsString()
  @MinLength(2)
  color!: string;
}