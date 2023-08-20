// app.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { XmlService } from '../../services/air-avail/xmlAirAvail.service';
import { NoFlightsAvailableException } from '../../filters/execption/no-flights-available.exception';
import { FlightService } from '../../services/flight/flight.service';

@Controller()
export class ItinerariesController {
  constructor(
    private readonly xmlService: XmlService,
    private readonly flightService: FlightService,
  ) {}

  @Post('getItineraries')
  async receiveData(
    @Body('fecha') fecha: string,
    @Body('origen') origen: string,
    @Body('destino') destino: string,
    @Body('cant') cant: number,
  ): Promise<any> {
    try {
      // Llama al servicio XmlService para generar y enviar el XML
      const jsonResponse = await this.xmlService.generateAndSendXml({
        fecha,
        origen,
        destino,
        cant: cant,
      });

      return this.validateResponse(jsonResponse, cant);
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

  validateResponse(jsonResponse: any, PassengerQuantity: number): any {
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
      ///go serviceesss
      const originDestOptions =
        jsonResponse.KIU_AirAvailRS.OriginDestinationInformation[0]
          .OriginDestinationOptions[0].OriginDestinationOption;

      const formattedInfo =
        this.flightService.formatItinerariesResponse(originDestOptions);

      return formattedInfo;
    }
  }
}
