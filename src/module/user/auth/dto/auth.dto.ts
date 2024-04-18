import { IsEmail, IsNotEmpty, IsString, IsInt, Allow } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  type: string;

  @Allow()
  gender: string;

  @Allow()
  phone: string;

  @IsNotEmpty()
  date_of_birth: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
