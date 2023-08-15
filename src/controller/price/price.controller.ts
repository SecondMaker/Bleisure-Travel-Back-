// price.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AirPriceService } from '../../services/air-price/air-price.service';

@Controller()
export class PriceController {
  constructor(private readonly airPriceService: AirPriceService) {}

  @Post('getPrice')
  async getPrice(@Body() flightData: any): Promise<any> {
    try {
      // Llama al servicio AirPriceService para obtener el precio del vuelo
      const price = await this.airPriceService.generateAndSendXml(flightData);

      return   this.formatPriceResponse( price );
    } catch (error) {
      // Maneja el error según tus necesidades
      return { error: 'Error al obtener el precio del vuelo' };
    }
  }
    
    formatPriceResponse(response: any) {
        const AirItineraryPricingInfo = response.KIU_AirPriceRS.PricedItineraries[0].PricedItinerary[0].AirItineraryPricingInfo[0]

        let fareSegment = {
            baseFare: AirItineraryPricingInfo.ItinTotalFare[0].BaseFare[0].$.Amount,
            totalFare : AirItineraryPricingInfo.ItinTotalFare[0].TotalFare[0].$.Amount
        }
        return fareSegment
    }
}
