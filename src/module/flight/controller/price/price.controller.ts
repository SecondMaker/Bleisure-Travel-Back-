// price.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AirPriceService } from '../../services/air-price/air-price.service';

@Controller()
export class PriceController {
  constructor(private readonly airPriceService: AirPriceService) {}

  @Post('getPrice')
  async getPrice(@Body() flightData: any, priceData: any): Promise<any> {
    try {
      // Llama al servicio AirPriceService para obtener el precio del vuelo
      const price = await this.airPriceService.generateAndSendXml(flightData, priceData);

      return this.formatPriceResponse(price);
    } catch (error) {
      // Maneja el error según tus necesidades
      return { error: 'Error al obtener el precio del vuelo' };
    }
  }
  extractTaxInfo(data: any): { TaxCode: string; Amount: string }[] {
    return data.map((tax: any) => {
      return {
        TaxCode: tax.$.TaxCode,
        Amount: tax.$.Amount,
      };
    });
  }
  formatPriceResponse(response: any) {
    let fareSegment = {};
    if (response.KIU_AirPriceRS.Error) {
      fareSegment = {
        error: response.KIU_AirPriceRS.Error[0].ErrorMsg[0],
      };
    } else {
      const AirItineraryPricingInfo =
        response.KIU_AirPriceRS.PricedItineraries[0].PricedItinerary[0]
          .AirItineraryPricingInfo[0];

      fareSegment = {
        baseFare: AirItineraryPricingInfo.ItinTotalFare[0].BaseFare[0].$.Amount,
        totalFare:
          AirItineraryPricingInfo.ItinTotalFare[0].TotalFare[0].$.Amount,
        taxes: this.extractTaxInfo(
          AirItineraryPricingInfo.ItinTotalFare[0].Taxes[0].Tax,
        ),
      };
    }

    return fareSegment;
  }
}
