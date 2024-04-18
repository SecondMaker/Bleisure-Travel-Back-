// app.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AirAvailService } from '../../services/air-avail/air-avail.service';
import { NoFlightsAvailableException } from '../../../../filters/execption/no-flights-available.exception';
import { FlightService } from '../../services/flight/flight.service';

@Controller()
export class ItinerariesController {
  constructor(
    private readonly airAvailService: AirAvailService,
    private readonly flightService: FlightService,
  ) {}

  @Post('getItineraries')
  async receiveData(
    @Body('fecha') fecha: string,
    @Body('origen') origen: string,
    @Body('destino') destino: string,
    @Body('cant') cant: number,
    @Body('ADT') adt: number,
    @Body('CHD') chd: number,
    @Body('INF') inf: number,
  ): Promise<any> {
    try {
      const jsonResponse = await this.airAvailService.generateAndSendXml({
        fecha,
        origen,
        destino,
        cant: cant,
        adt: adt,
        chd: chd,
        inf: inf,
      });

      //return this.validateResponse(jsonResponse);
      return jsonResponse;
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

  validateResponse(jsonResponse: any): any {
    if (jsonResponse.Root || jsonResponse.KIU_AirAvailRS.Error) {
      return jsonResponse;
    } else {
      const originDestInfo =
        jsonResponse.KIU_AirAvailRS.OriginDestinationInformation[0];
      if (
        !originDestInfo.OriginDestinationOptions[0] ||
        !Array.isArray(
          originDestInfo.OriginDestinationOptions[0].OriginDestinationOption,
        )
      ) {
        throw new NoFlightsAvailableException();
      } else {
        const originDestOptions =
          jsonResponse.KIU_AirAvailRS.OriginDestinationInformation[0]
            .OriginDestinationOptions[0].OriginDestinationOption;

        const formattedInfo =
          this.flightService.formatItinerariesResponse(originDestOptions);

        return formattedInfo;
      }
    }
  }
}
