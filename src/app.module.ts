import { Module, Logger } from '@nestjs/common';
import { FlightModule } from './module/flight/flight.module'; 
import { LoggerModule } from 'nestjs-pino';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './filters/execption/execption.filter';
import { NoFlightsAvailableException } from './filters/execption/no-flights-available.exception';
import { CustomConfigModule } from './config.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CustomConfigModule,
    FlightModule
  ],
  
  providers: [
    Logger,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    NoFlightsAvailableException,
  ],
})
export class AppModule {}
