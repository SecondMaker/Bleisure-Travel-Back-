import { Module, Logger } from '@nestjs/common';
import { FlightModule } from './module/flight/flight.module';
import { AuthModule } from './module/flight/controller/auth/auth.module';  
import { LoggerModule } from 'nestjs-pino';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './filters/execption/execption.filter';
import { NoFlightsAvailableException } from './filters/execption/no-flights-available.exception';
import { CustomConfigModule } from './config.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
//import { RedisModule } from './redis-config/redis-config.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserController } from './module/flight/controller/user/user.controller';
import { BookingModule } from './module/flight/controller/booking/booking.module';



@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CustomConfigModule,
    FlightModule,
    AuthModule,
    BookingModule,
    //RedisModule,
    PrismaModule
  ],
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    NoFlightsAvailableException,
  ],
  controllers: [UserController],
})
export class AppModule {}
