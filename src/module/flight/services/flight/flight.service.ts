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
    adt: number,
    chd: number,
    inf: number
  ): Promise<any[]> {

    const formattedInfo = [];
  
    for (const originDestOption of originDestOptions) {
      const flightsForOption = [];
  
      for (const flightSegment of originDestOption.FlightSegment) {
        const bookingClassAvail = flightSegment.BookingClassAvail;
  
        const flightData = {
          FlightNumber: flightSegment.$.FlightNumber,
          DepartureDateTime: flightSegment.$.DepartureDateTime,
          ArrivalDateTime: flightSegment.$.ArrivalDateTime,
          JourneyDuration: flightSegment.$.JourneyDuration,
          MarketingAirline: flightSegment.MarketingAirline[0].$.CompanyShortName,
          DepartureAirport: flightSegment.DepartureAirport[0].$.LocationCode,
          ArrivalAirport: flightSegment.ArrivalAirport[0].$.LocationCode,
        };
  
        const flightInfo = {
          ...flightData,
          Prices: [],
        };
  
        for (const classAvail of bookingClassAvail) {
          const priceData = {
            ResBookDesigCode: classAvail.$.ResBookDesigCode,
            ResBookDesigQuantity: classAvail.$.ResBookDesigQuantity,
            adt: adt,
            chd: chd,
            inf: inf,

            PassengerQuantity: PassengerQuantity,
            AirPriceResponse: {}, // Añadir un objeto vacío si no se tiene información
          };
  
          const airPriceResponse = await this.airPriceService.generateAndSendXml({
            flightData
          }, {priceData});
  
          const formattedPriceResponse = this.formatPriceResponse(airPriceResponse);
  
          if (!formattedPriceResponse.hasOwnProperty('error')) {
            priceData.AirPriceResponse = formattedPriceResponse;
            flightInfo.Prices.push(priceData);
          }
        }
  
        flightsForOption.push(flightInfo);
      }
  
      formattedInfo.push({flights: flightsForOption });
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
  async formatFlightFromDestinations(destinationsList: any[]): Promise<any[]> {    const formattedFlights = destinationsList.map((destination) => {
      const departureInfo = destination.DepartureInformation[0];
      const arrivalInfo = destination.ArrivalInformation[0];
  
      const departureCountry = departureInfo.Country[0];
      const departureCountryName = departureInfo.CountryName[0];
      const departureLocationName = departureInfo.LocationName[0];
      const departureLocationCity = departureInfo.LocationCode[0]._;
      
      const arrivalCountry = arrivalInfo.Country[0];
      const arrivalCountryName = arrivalInfo.CountryName[0];
      const arrivalLocationName = arrivalInfo.LocationName[0];
      const arrivalLocationCity = arrivalInfo.LocationCode[0]._;

      const flightId= departureInfo.LocationCode[0]._+arrivalInfo.LocationCode[0]._
  
      return {
        flightId: flightId,
        DepartureCountryName: departureCountryName,  
        DepartureCountry: departureCountry,
        DepartureLocationName: departureLocationName,
        IATAdestination: departureLocationCity,

        ArrivalCountryName: arrivalCountryName,
        ArrivalCountry: arrivalCountry,
        ArrivalLocationName: arrivalLocationName,
        IATAarrival: arrivalLocationCity,
      };
    });
    
    return formattedFlights;
  }
}
