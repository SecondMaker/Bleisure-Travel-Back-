import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { get } from 'http';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingDto } from './dto/booking.dto';
import { TicketDto } from './dto/ticket.dto';
import { BookingService } from './booking.service';
import { JwtStrategy } from '../auth/strategy';

@UseGuards(AuthGuard('jwt'))
@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post('save')
  save(@Body() dto: BookingDto, @Req() req: any) {
    return this.bookingService.save(dto, req);
  }

  @Get('list')
  list(@Req() req: any) {
    return this.bookingService.Bookinglist(req);
  }

  @Get('Clientlist')
  Clientlist(@Req() req: any) {
    return this.bookingService.BookinglistClient(req);
  }

  @Patch('UpdateTicket')
  UpdateTicket(@Body() dto: TicketDto, @Req() req: any) {
    return this.bookingService.BookingUpdate(dto, req);
  }
}
