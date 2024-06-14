import { Body, Controller, ParseIntPipe, Delete, Post, Req } from '@nestjs/common';
import { AuthServices } from './auth.services';
import { Request } from 'express';
import { AuthDto } from './dto';
import { DeleteInfoDto, DeleteUserDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthServices) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: LoginDto) {
    return this.authService.signin(dto);
  }

  @Delete('DeleteUser')
  DeleteUser(@Body() dto: DeleteUserDto, @Req() req: any){
    return this.authService.UserDelete(dto, req);
  }

  @Delete('DeleteUser_a_Info')
  DeleteInfo(@Body() dto: DeleteInfoDto, @Req() req: any){
    return this.authService.InfoDelete(dto, req);
  }
}
