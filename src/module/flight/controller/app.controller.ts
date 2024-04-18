// app.controller.ts
import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { AirAvailService } from '../services/air-avail/air-avail.service';
import { Redis } from 'ioredis';

import { NoFlightsAvailableException } from '../../../filters/execption/no-flights-available.exception';
import { FlightService } from '../services/flight/flight.service';

@Controller()
export class AppController {
  constructor(
    // @Inject('REDIS_CONNECTION') private readonly redisClient: Redis,
    private readonly airAvailService: AirAvailService,
    private readonly flightService: FlightService,
  ) {}

  @Get('search')
  async receiveData(
    @Query('fecha') fecha: string,
    @Query('origen') origen: string,
    @Query('destino') destino: string,
    @Query('cant') cant: number,
    @Query('ADT') adt: number,
    @Query('CHD') chd: number,
    @Query('INF') inf: number,
  ): Promise<any> {
    const useRedis = process.env.USE_REDIS === 'true';

    try {
      const key = `${fecha}-${origen}-${destino}`;
      const existingData = false; //await this.redisClient.get(key);

      if (existingData && useRedis) {
        // Si la clave ya existe, devuelve los datos existentes
        return JSON.parse(existingData);
      } else {
        // Llama al servicio airAvailService para generar y enviar el XML
        const jsonResponse = await this.airAvailService.generateAndSendXml({
          fecha,
          origen,
          destino,
          cant: cant,
          adt: adt,
          chd: chd,
          inf: inf,
        });

        const formattedInfo = await this.validateResponse(
          jsonResponse,
          cant,
          adt,
          chd,
          inf,
        );
        //if (useRedis) await this.redisClient.set(key, JSON.stringify(formattedInfo));

        return formattedInfo;
      }
    } catch (error) {
      if (error instanceof NoFlightsAvailableException) {
        throw new HttpException(
          'No flights available for this route',
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          'Error al procesar la solicitud',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  async validateResponse(
    jsonResponse: any,
    PassengerQuantity: number,
    adt: number,
    chd: number,
    inf: number,
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
      const originDestOptions =
        jsonResponse.KIU_AirAvailRS.OriginDestinationInformation[0]
          .OriginDestinationOptions[0].OriginDestinationOption;

      const formattedInfo =
        this.flightService.formatBookingClassAvailAndFlightInfo(
          originDestOptions,
          PassengerQuantity,
          adt,
          chd,
          inf,
        );

      return formattedInfo;
    }
  }
}
