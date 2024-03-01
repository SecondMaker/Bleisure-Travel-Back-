import { IsEmail, IsNotEmpty, IsString, IsInt} from "class-validator"
import { IntegerType } from "typeorm"

export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    type: string

    gender: string

    @IsNotEmpty()
    date_of_birth: string

  /* @IsInt()
    phone: string */
}

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}