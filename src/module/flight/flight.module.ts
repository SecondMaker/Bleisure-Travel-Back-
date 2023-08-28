import { Module } from '@nestjs/common';
import { RedisModule } from '../../redis-config/redis-config.module'; // Importa el RedisModule aquí
import { AppController } from './controller/app.controller';
import { PriceController } from './controller/price/price.controller';
import { ItinerariesController } from './controller/itineraries/itineraries.controller';
import { ParseToJsonService } from './services/parse-to-json/parse-to-json.service';
import { AirAvailService } from './services/air-avail/air-avail.service';
import { AirPriceService } from './services/air-price/air-price.service';
import { FlightService } from './services/flight/flight.service';
import { SharedService } from './services/shared/shared.service';

import { ConfigModule } from '@nestjs/config';
import { TestRedisController } from './test-redis/test-redis.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisModule, // Asegúrate de importar el RedisModule aquí
  ],
  controllers: [AppController, PriceController, ItinerariesController, TestRedisController],
  providers: [
    AirAvailService,
    AirPriceService,
    FlightService,
    SharedService,
    ParseToJsonService,
  ],
})
export class FlightModule {}