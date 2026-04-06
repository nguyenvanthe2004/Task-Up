import { IsEmail, IsNumberString, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
export class VerifyUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  code: string;
}
export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
export class UpdateProfileDto {
  @IsString()
  @MinLength(2)
  fullName: string;

  @IsString()
  phone: string;
}
export class UpdatePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}