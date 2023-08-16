// flight.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class FlightService {
  formatJsonResponse(jsonResponse: any) {
    console.log('hip', jsonResponse);
    const originDestOptions =
      jsonResponse.OriginDestinationOptions[0].OriginDestinationOption;

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
          flightSegment.$.FlightNumbe,
          flightSegment.$.DepartureDateTime,
          flightSegment.$.ArrivalDateTime,
          flightSegment.MarketingAirline[0].$.CompanyShortName,
          flightSegment.DepartureAirport[0].$.LocationCode,
          flightSegment.ArrivalAirport[0].$.LocationCode,
        ),
      };

      return formattedFlightSegment;
    });

    const formattedResponse = {
      DepartureDateTime: jsonResponse.DepartureDateTime[0],
      OriginLocation: jsonResponse.OriginLocation[0],
      DestinationLocation: jsonResponse.DestinationLocation[0],
      FlightSegments: flightSegments,
    };

    return formattedResponse;
  }

  formatBookingClassAvail(
    BookingClassAvail: any,
    FlightN: string,
    Dtime: string,
    Atime: string,
    Airlinecode: string,
    Dairport: string,
    AairPort: string,
  ) {
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

  formatBookingClassAvailAndFlightInfo(originDestOptions: any[]): any[] {
    const formattedInfo = [];

    originDestOptions.forEach((originDestOption) => {
      const flightSegment = originDestOption.FlightSegment[0];
      const bookingClassAvail = flightSegment.BookingClassAvail;

      bookingClassAvail.forEach((classAvail) => {
        formattedInfo.push({
          FlightN: flightSegment.$.FlightNumber,
          Dtime: flightSegment.$.DepartureDateTime,
          Atime: flightSegment.$.ArrivalDateTime,
          Airlinecode: flightSegment.MarketingAirline[0].$.CompanyShortName,
          Dairport: flightSegment.DepartureAirport[0].$.LocationCode,
          AairPort: flightSegment.ArrivalAirport[0].$.LocationCode,
          ResBookDesigCode: classAvail.$.ResBookDesigCode,
          ResBookDesigQuantity: classAvail.$.ResBookDesigQuantity,
        });
      });
    });

    return formattedInfo;
  }
}
