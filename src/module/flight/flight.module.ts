import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { PriceController } from './controller/price/price.controller';
import { ItinerariesController } from './controller/itineraries/itineraries.controller';
import { ParseToJsonService } from './services/parse-to-json/parse-to-json.service';
import { AirAvailService } from './services/air-avail/air-avail.service';
import { AirPriceService } from './services/air-price/air-price.service';
import { FlightService } from './services/flight/flight.service';
import { SharedService } from './services/shared/shared.service';
@Module({

    controllers: [AppController, PriceController, ItinerariesController],
    providers : [AirAvailService, AirPriceService, FlightService, SharedService, ParseToJsonService]
})
export class FlightModule {}
