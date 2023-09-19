import { Controller, Get, Query } from '@nestjs/common';
import { AirAvailService } from '../services/air-avail/air-avail.service';
import { NoFlightsAvailableException } from '../../../filters/execption/no-flights-available.exception';
import { FlightService } from '../services/flight/flight.service';
@Controller('batch')
export class BatchController {
  constructor(private readonly airAvailService: AirAvailService, private readonly flightService: FlightService) {}

  @Get('search')
  async searchAvailability(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('origin') origin: string,
    @Query('destination') destination: string,
  ): Promise<any[]> {
    const results = [];

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Iterate through each day in the date range
    for (let currentDate = start; currentDate <= end; currentDate.setDate(currentDate.getDate() + 1)) {
      const travelData = {
        fecha: currentDate.toISOString().slice(0, 10), // Formato yyyy-mm-dd
        origen: origin,
        destino: destination,
        cant: 1, // Cantidad de pasajeros
      };

      try {
        const jsonResponse = await this.airAvailService.generateAndSendXml(travelData);
        results.push(this.validateResponse(jsonResponse));
      } catch (error) {
        // Handle errors as needed
        results.push(`Error fetching data for ${travelData.fecha}: ${error.message}`);
        continue; // Continuar con la siguiente iteración del bucle
      }
    }
    return results;
  }

  validateResponse(jsonResponse: any): any {
    const originDestInfo =
      jsonResponse.KIU_AirAvailRS.OriginDestinationInformation[0];
    if (
      !originDestInfo.OriginDestinationOptions[0] ||
      !Array.isArray(
        originDestInfo.OriginDestinationOptions[0].OriginDestinationOption,
      )
    ) {
      return jsonResponse
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