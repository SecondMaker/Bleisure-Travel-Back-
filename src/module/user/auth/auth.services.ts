import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { isEmpty } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/auth.dto';
import { User } from '@prisma/client';
import { type } from 'os';

@Injectable({})
export class AuthServices {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    //generar hash para el password
    const hash = await argon.hash(dto.password);
    //validacion del tipo si es vacio se crea un cliente
    if (isEmpty(dto.type)) {
      dto.type = 'client';
    }

    //guardar usuario
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      await this.prisma.info_clientes.create({
        data: {
          name: dto.name,
          type: dto.type,
          gender: dto.gender,
          phone: dto.phone,
          date_of_birth: dto.date_of_birth,
          userId: user.id,
        },
      });
      //devolver respuesta
      return {result: "success" };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new ForbiddenException('Usuario duplicado');
        }
      }
      throw error;
    }
  }

  async signin(dto: LoginDto) {
    //Buscar el usuario
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    //Si el usuario no existe arrojar excepcion
    if (!user) throw new ForbiddenException('Usuario incorrecto');
    //Verificacion contraseñas
    const pwMatches = await argon.verify(user.hash, dto.password);
    //Si la contraseña no es correcta
    if (!pwMatches) {
      throw new ForbiddenException('Usuario incorrecto');
    }

    const info_cliente = await this.prisma.info_clientes.findUnique({
      where: {
        userId: user.id,
      },
    });

    //Devolvemos respuesta
    return this.signToken(
      user.id,
      info_cliente.type,
      info_cliente.name,
      user.email,
    );
  }

  async signToken(userId: number, type: string, name: string, email: string) {
    const payload = {
      sub: userId,
      type: type,
      name: name,
      email: email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });
    return { access_token: token };
  }
}
