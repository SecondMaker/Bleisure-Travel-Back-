import { Module, Logger } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino'; // Asegúrate de importar el módulo de registro LoggerModule
import { AppController } from './controller/app.controller';
import { AppService } from './app.service';
import { XmlService } from './services/xmlAirAvail.service';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './filters/execption/execption.filter';
import { NoFlightsAvailableException } from './filters/execption/no-flights-available.exception';

@Module({
  imports: [    LoggerModule.forRoot(), ],
  controllers: [AppController],
  providers: [AppService, XmlService, Logger,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    NoFlightsAvailableException,
  ],
})
export class AppModule {}
