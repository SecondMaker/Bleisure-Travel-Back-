// app.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { XmlService } from './xml-generator/xmlAirAvail.service';

@Controller()
export class AppController {
  constructor(private readonly xmlService: XmlService) {}

  @Post('search')
  async receiveData(
    @Body('fecha') fecha: string,
    @Body('origen') origen: string,
    @Body('destino') destino: string,
    @Body('cant') cant: number,
  ): Promise<any> {
    // Llama al servicio XmlService para generar y enviar el XML
    const jsonResponse = await this.xmlService.generateAndSendXml({
      fecha,
      origen,
      destino,
      cant: cant, // Asegúrate de usar la misma nomenclatura de propiedades
    });
    return this.formatJsonResponse(jsonResponse);
  }

  formatJsonResponse(jsonResponse: any): any {
    const originDestInfo = jsonResponse.KIU_AirAvailRS.OriginDestinationInformation[0];
    const originDestOptions = originDestInfo.OriginDestinationOptions[0].OriginDestinationOption;
    const flightSegments = originDestOptions.map((option) => {
      const flightSegment = option.FlightSegment[0];

      let formattedFlightSegment = {
        DepartureDateTime: flightSegment.$.DepartureDateTime,
        ArrivalDateTime: flightSegment.$.ArrivalDateTime,
        StopQuantity: flightSegment.$.StopQuantity,
        FlightNumber: flightSegment.$.FlightNumber,
        JourneyDuration: flightSegment.$.JourneyDuration,
        DepartureAirport: flightSegment.DepartureAirport[0].$.LocationCode,
        ArrivalAirport: flightSegment.ArrivalAirport[0].$.LocationCode,
        Equipment: flightSegment.Equipment[0].$.AirEquipType,
        MarketingAirline: flightSegment.MarketingAirline[0].$.CompanyShortName,
        Meal: flightSegment.Meal[0].$.MealCode,
        MarketingCabin: this.formatMarketingCabin(flightSegment.MarketingCabin),
        BookingClassAvail : this.formatBookingClassAvail(flightSegment.BookingClassAvail)
      };

      return formattedFlightSegment; // ;
    });

    const formattedResponse = {
      DepartureDateTime: originDestInfo.DepartureDateTime[0],
      OriginLocation: originDestInfo.OriginLocation[0],
      DestinationLocation: originDestInfo.DestinationLocation[0],
      FlightSegments: flightSegments,
    };

    return formattedResponse;
  }

  formatMarketingCabin(MarketingCabin: any) {
    let MarketingCabinFormatted = MarketingCabin.map((cabin) => {
      return {
        CabinType: cabin.$.CabinType,
        RPH: cabin.$.RPH,
      };
    });

    return MarketingCabinFormatted;
  }

  formatBookingClassAvail(BookingClassAvail: any) {
    let BookingClassAvailFormatted = BookingClassAvail.map((classAvail) => {
      return {
        ResBookDesigCode: classAvail.$.ResBookDesigCode,
        ResBookDesigQuantity: classAvail.$.ResBookDesigQuantity,
        RPH : classAvail.$.RPH
     }
    })
    
    return BookingClassAvailFormatted
 }
}
