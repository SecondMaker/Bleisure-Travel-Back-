import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { CustomConfigModule } from './config.module';

import { FlightModule } from './module/flight/flight.module';
import { UserModule } from './module/user/user.module';
import { PaymentModule } from './module/payment/payment.module';

import { CustomExceptionFilter } from './filters/execption/execption.filter';
import { NoFlightsAvailableException } from './filters/execption/no-flights-available.exception';

//import { RedisModule } from './redis-config/redis-config.module';
import { PrismaModule } from './prisma/prisma.module';
import { KeyUpdateService } from './schedule/updateKey';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CustomConfigModule,
    FlightModule,
    UserModule,
    PaymentModule,
    //RedisModule,
    PrismaModule,
  ],
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    NoFlightsAvailableException,
    KeyUpdateService,
  ],
  controllers: [],
})
export class AppModule {}
