import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { destinationService } from '../../services/destination/destination.service';
import { FlightService } from '../../services/flight/flight.service';
const AirPortList2 = [
  '5R',
  'QL',
  'WW',
  '9V',
  'ES',
  'T9',
  'DO',
  'L5',
  'PU',
  '1F',
  'KN',
  'CV',
  'O3',
];
import { Redis } from 'ioredis';
@Controller('destinations')
export class DestinationController {
  constructor(
    @Inject('REDIS_CONNECTION') private readonly redisClient: Redis,
    private readonly destinationService: destinationService,
    private readonly flightService: FlightService,
  ) {}

  @Get()
  async getAllRoutes(): Promise<any> {
    const key = 'list-destinations';
    const existingData = await this.redisClient.get(key);

    if (existingData) {
      return JSON.stringify(existingData);
    }

    const airportsData = new Map<string, any>();
    const routesSet = new Set<any>();

    await Promise.all(
      AirPortList2.map(async (airPortCode) => {
        try {
          const jsonResponse = await this.destinationService.generateAndSendXml(
            airPortCode,
          );
          const formattedResponse = this.formatResponse(jsonResponse);
          const routes = await this.flightService.formatFlightFromDestinations(
            await formattedResponse,
          );
        

          for (const route of routes) {
            const departureIATA = route.IATAdestination;
            const arrivalIATA = route.IATAarrival;

            if (!airportsData.has(departureIATA)) {
              airportsData.set(departureIATA, {
                iata: departureIATA,
                country: route.DepartureCountryName,
                code: route.DepartureCountry,
                locationName: route.DepartureLocationName,
              });
            }

            if (!airportsData.has(arrivalIATA)) {
              airportsData.set(arrivalIATA, {
                iata: arrivalIATA,
                country: route.ArrivalCountryName,
                code: route.ArrivalCountry,
                locationName: route.ArrivalLocationName,
              });
            }

            routesSet.add(route.flightId);
          }
        } catch (error) {
          console.error(
            `Error fetching data for ${airPortCode}: ${error.message}`,
          );
        }
      }),
    );

    const origenes = Array.from(airportsData.values());
    const destinos = Array.from(airportsData.values());
    const routesList = Array.from(routesSet);

    const origenDestino = [origenes, destinos, routesList]  ;

    return origenDestino;
  }

  async formatResponse(json: any) {
    const destinations =
      json.KIU_GetOriginDestinationInfoRS.OriginDestinationsInformation[0];
    if (destinations) {
      return destinations.OriginDestinationOption;
    } else {
      console.log('error response', json);
    }
  }
}
