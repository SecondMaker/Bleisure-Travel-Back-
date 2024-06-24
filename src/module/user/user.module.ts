import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthServices } from './auth/auth.services';
import { BookingController } from './booking/booking.controller';
import { BookingService } from './booking/booking.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/strategy';
import { UserController } from './user/user.controller';
import { UploadController } from '../docs/excel.controller';
import { ExcelService } from '../docs/excel.service';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [AuthController, BookingController, UserController, UploadController ],
  providers: [AuthServices, JwtStrategy, BookingService, ExcelService],
})
export class UserModule {}
