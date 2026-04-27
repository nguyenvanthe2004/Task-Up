import { Type } from "class-transformer";
import {
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
  IsDate,
  IsDateString,
  IsEnum,
  IsArray,
  IsInt,
} from "class-validator";
import { PriorityStatus } from "../models/Task";

export class CreateTaskDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(2)
  description!: string;

  @IsOptional()
  @IsEnum(PriorityStatus)
  priority?: PriorityStatus;

  @IsOptional()
  @IsString()
  @MinLength(2)
  tag?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsNumber()
  statusId?: number;

  @IsNumber()
  listId!: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  assignees?: number[];
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  description?: string;

  @IsOptional()
  @IsEnum(PriorityStatus)
  priority?: PriorityStatus;

  @IsOptional()
  @IsString()
  @MinLength(2)
  tag?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
  
  @IsOptional()
  @IsNumber()
  statusId?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  assignees?: number[];
}
