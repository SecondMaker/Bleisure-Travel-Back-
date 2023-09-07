// app.controller.ts
import {
    Controller,
    Post,
    Body,
    HttpException,
    HttpStatus,
    Inject,
  } from '@nestjs/common';
  import { AirAvailService } from '../services/air-avail/air-avail.service';
  import { Redis } from 'ioredis';
  import { NoFlightsAvailableException } from '../../../filters/execption/no-flights-available.exception';
  import { FlightService } from '../services/flight/flight.service'; // Asegúrate de importar el servicio RedisService

@Controller('batch')
export class BatchController {
  constructor(
    @Inject('REDIS_CONNECTION') private readonly redisClient: Redis,
    private readonly flightService: FlightService,
    private readonly airAvailService: AirAvailService,
  ) {}

  @Post('load-data')
  async loadData(
    @Body('origen') origen: string,
    @Body('destino') destino: string,
  ): Promise<void> {
    const startDate = new Date('2023-08-30');
    const endDate = new Date('2023-09-30');
    //const oneDay = 24 * 60 * 60 * 1000; // Milisegundos en un día
    
    for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
      const fecha = currentDate.toISOString().slice(0, 10); // Formato yyyy-mm-dd
      
      const key = `${fecha}-${origen}-${destino}`;
      const existingData = await this.redisClient.get(key);
    
      if (!existingData) {
        const jsonResponse = await this.airAvailService.generateAndSendXml({
          fecha,
          origen,
          destino,
          cant: 1, // Cantidad de pasajeros
        });
    
        const formattedInfo = await this.validateResponse(jsonResponse, 1);
    
        await this.redisClient.set(key, JSON.stringify(formattedInfo));
      }
    }
  }
  async validateResponse(
    jsonResponse: any,
    PassengerQuantity: number,
  ): Promise<any> {
    const originDestInfo =
      jsonResponse.KIU_AirAvailRS.OriginDestinationInformation[0];
    if (
      !originDestInfo.OriginDestinationOptions[0] ||
      !Array.isArray(
        originDestInfo.OriginDestinationOptions[0].OriginDestinationOption,
      )
    ) {
      console.log('go to execption..');
      throw new NoFlightsAvailableException();
    } else {
      ///go serviceesss
      const originDestOptions =
        jsonResponse.KIU_AirAvailRS.OriginDestinationInformation[0]
          .OriginDestinationOptions[0].OriginDestinationOption;

      const formattedInfo =
        this.flightService.formatBookingClassAvailAndFlightInfo(
          originDestOptions,
          PassengerQuantity,
        );

      return formattedInfo;
    }
  }
}
