import { Body, Controller, ParseIntPipe, Post, Req } from '@nestjs/common';
import {AuthServices} from './auth.services';
import { Request } from 'express';
import { AuthDto } from './dto';
import { LoginDto } from './dto/auth.dto';


@Controller('auth')

export class AuthController{

    constructor(private authService: AuthServices){}

    @Post('signup')

    signup(
        @Body() dto: AuthDto,
        ){
        return this.authService.signup(dto);
    }

    @Post('signin')

    signin(
        @Body() dto: LoginDto,
        ){
        return this.authService.signin(dto);
    }

}
