import { Module, Logger } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino'; // Asegúrate de importar el módulo de registro LoggerModule
import { AppController } from './controller/app.controller';
import { PriceController } from './controller/price/price.controller'
import { AppService } from './app.service';
import { XmlService } from './services/air-avail/xmlAirAvail.service';
import { AirPriceService } from './services/air-price/air-price.service'
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './filters/execption/execption.filter';
import { NoFlightsAvailableException } from './filters/execption/no-flights-available.exception';
import { SharedService } from './services/shared/shared.service';
import { CustomConfigModule } from './config.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CustomConfigModule,
  ],
  controllers: [AppController, PriceController],
  providers: [
    AppService,
    XmlService,
    AirPriceService,
    Logger,
    SharedService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    NoFlightsAvailableException,
  ],
})
export class AppModule {}
