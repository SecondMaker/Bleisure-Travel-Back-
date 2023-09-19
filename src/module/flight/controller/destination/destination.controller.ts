import { Controller, Get } from '@nestjs/common';
import { destinationService } from '../../services/destination/destination.service';
//import { FlightService } from '../services/flight/flight.service';
@Controller()
export class DestinationController {
  constructor(private readonly airDestinations: destinationService) {}

  @Get('destinations')
  async searchAvailability(

  ): Promise<any> {
    let results;
    // Iterate through each day in the date range
      try {
          const jsonResponse = await this.airDestinations.generateAndSendXml();
          results = this.formatResponse(jsonResponse)
      } catch (error) {
        // Handle errors as needed
        results = (`Error fetching data for ${error.message}`);
      }
      return results
  }
    
    formatResponse(json: any) {
        const destinations = json.KIU_GetOriginDestinationInfoRS.OriginDestinationsInformation[0]       
        if (destinations) {
            
            return destinations.OriginDestinationOption
      }
    } 

  
    
}