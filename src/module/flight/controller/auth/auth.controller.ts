import { Controller, Post } from '@nestjs/common';
import {AuthServices} from './auth.services';


@Controller('auth')

export class AuthController{

    constructor(private authService: AuthServices){}

    @Post('signup')

    signup(){
        return this.authService.signup();
    }

    @Post('signin')

    signin(){
        return this.authService.signin();
    }

}
