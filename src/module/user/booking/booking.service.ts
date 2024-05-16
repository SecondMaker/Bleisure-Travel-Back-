import { ForbiddenException, Injectable, Req } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { isEmpty } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { type } from 'os';
import { BookingDto } from './dto/booking.dto';
import { TicketDto } from './dto';
import { error } from 'console';

@Injectable({})
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async save(dto: BookingDto, req) {
    //guardar reserva
    try {
      const user = await this.prisma.bookings.create({
        data: {
          codigo_reserva: dto.codigo_reserva,
          status: dto.status,
          email: req.user.email,
          montoTotal: dto.montoTotal,
          montoAbonado: dto.montoAbonado,
          codigoTicket: dto.codigoTicket,
          userId: req.user.sub,
        },
      });

      const bearer = req.headers.authorization
      const token = bearer.slice(7)

      //devolver respuesta
      return {
        status: 'Guardado',
        token
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('Error');
      }
      throw error;
    }
  }

  async Bookinglist(@Req() req: any) {
    const Bookings_list = await this.prisma.bookings.findMany();

    const bearer = req.headers.authorization
    const token = bearer.slice(7)

    return {Bookings_list, token}
  }

  async BookinglistClient(@Req() req: any) {
    const Bookings_list_client = await this.prisma.bookings.findMany({
      where: { userId: req.user.sub },
    });

    const bearer = req.headers.authorization
    const token = bearer.slice(7)

    return {Bookings_list_client, token}
  }

  async BookingUpdate(dto: TicketDto, req) {
    const Bookings_ticket = await this.prisma.bookings.update({
      where: { codigo_reserva: dto.codigo_reserva },
      data: {
        status: dto.status,
        montoTotal: dto.montoTotal,
        montoAbonado: dto.montoAbonado,
        codigoTicket: dto.codigoTicket,
      },
    });

    const bearer = req.headers.authorization
    const token = bearer.slice(7)
    
    return {
      Bookings_ticket, token
    }
  }

}
