import { Module } from '@nestjs/common';
//controllers
import { AppController } from './controller/app.controller';
import { PriceController } from './controller/price/price.controller';
import { ItinerariesController } from './controller/itineraries/itineraries.controller';
import { BatchController } from './batch/batch.controller';
import { DestinationController } from './controller/destination/destination.controller';
import { BookController } from './controller/book/book.controller';
import { TicketController } from './controller/ticket/ticket.controller';

//services
import { ParseToJsonService } from './services/parse-to-json/parse-to-json.service';
import { AirAvailService } from './services/air-avail/air-avail.service';
import { AirPriceService } from './services/air-price/air-price.service';
import { FlightService } from './services/flight/flight.service';
import { SharedService } from './services/shared/shared.service';
import { destinationService } from './services/destination/destination.service';
import { AirBookService } from './services/air-book/air-book.service';
import { AirTicketService } from './services/air-ticket/air-ticket.service';
import { AirPriceReservationService } from './services/air-price-reservation/air-price-reservation.service';
//config
//import { RedisModule } from '../../redis-config/redis-config.module';
import { ConfigModule } from '@nestjs/config';

import { TestRedisController } from './test-redis/test-redis.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    //RedisModule, // Asegúrate de importar el RedisModule aquí
  ],
  controllers: [
    AppController,
    PriceController,
    ItinerariesController,
    TestRedisController,
    BatchController,
    DestinationController,
    BookController,
    TicketController,
  ],
  providers: [
    AirAvailService,
    AirPriceService,
    FlightService,
    SharedService,
    ParseToJsonService,
    destinationService,
    AirBookService,
    AirTicketService,
    AirPriceReservationService,
  ],
})
export class FlightModule {}
