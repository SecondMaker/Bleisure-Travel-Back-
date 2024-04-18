import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { get } from 'http';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('user')
export class UserController {
  constructor(private prisma: PrismaService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('info')
  async getInfo(@Req() req: any) {
    //Buscar el usuario
    const user_info = await this.prisma.info_clientes.findUnique({
      where: {
        userId: req.user.sub,
      },
    });

    return user_info;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  async userList(@Req() req: any) {
    //Buscar lstado de usuarios
    const user_list = await this.prisma.info_clientes.findMany();

    return user_list;
  }
}
