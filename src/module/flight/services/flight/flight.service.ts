// flight.service.ts
import { AirPriceService } from '../air-price/air-price.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FlightService {
  constructor(private readonly airPriceService: AirPriceService) {}

  formatItinerariesResponse(originDestOptions: any) {
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
        BookingClassAvail: this.formatBookingClassAvail(
          flightSegment.BookingClassAvail,
        ),
      };

      return formattedFlightSegment;
    });

    return flightSegments;
  }

  formatBookingClassAvail(BookingClassAvail: any) {
    let BookingClassAvailFormatted = BookingClassAvail.map((classAvail) => {
      return {
        ResBookDesigCode: classAvail.$.ResBookDesigCode,
        ResBookDesigQuantity: classAvail.$.ResBookDesigQuantity,
        RPH: classAvail.$.RPH,
      };
    });

    return BookingClassAvailFormatted;
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

  async formatBookingClassAvailAndFlightInfo(
    originDestOptions: any[],
    PassengerQuantity: number,
  ): Promise<any[]> {
    const formattedInfo = [];

    for (const originDestOption of originDestOptions) {
      const flightSegment = originDestOption.FlightSegment[0];
      const bookingClassAvail = flightSegment.BookingClassAvail;

      for (const classAvail of bookingClassAvail) {
        const flightData = {
          FlightNumber: flightSegment.$.FlightNumber,
          DepartureDateTime: flightSegment.$.DepartureDateTime,
          ArrivalDateTime: flightSegment.$.ArrivalDateTime,
          MarketingAirline:
            flightSegment.MarketingAirline[0].$.CompanyShortName,
          DepartureAirport: flightSegment.DepartureAirport[0].$.LocationCode,
          ArrivalAirport: flightSegment.ArrivalAirport[0].$.LocationCode,
          ResBookDesigCode: classAvail.$.ResBookDesigCode,
          ResBookDesigQuantity: classAvail.$.ResBookDesigQuantity,
          PassengerQuantity: PassengerQuantity,
        };

        const airPriceResponse = await this.airPriceService.generateAndSendXml(
          flightData,
        );

        const formattedPriceResponse =
          this.formatPriceResponse(airPriceResponse);

        if (!formattedPriceResponse.hasOwnProperty('error')) {
          formattedInfo.push({
            ...flightData,
            AirPriceResponse: formattedPriceResponse,
          });
        }
      }
    }

    return formattedInfo;
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
      };
    }
    return fareSegment;
  }
}
