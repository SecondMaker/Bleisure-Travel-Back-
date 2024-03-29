import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { get } from 'http';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingDto } from './dto/booking.dto';
import { BookingService } from './booking.service';
import { JwtStrategy } from '../auth/strategy';

@Controller('booking')
export class BookingController 
{
    constructor(private bookingService: BookingService, ){}
    @UseGuards(AuthGuard('jwt'))

    @Post('save')
    
    save(
        @Body() dto: BookingDto, @Req() req: any
        ){
        return this.bookingService.save(dto, req);
    }

    
}


