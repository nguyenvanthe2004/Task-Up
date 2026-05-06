import { IsNumber, IsString, MinLength } from "class-validator";


export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  content!: string;

  @IsNumber()
  taskId!: number;

}

export class UpdateCommentDto {
  @IsString()
  @MinLength(2)
  content!: string;

}