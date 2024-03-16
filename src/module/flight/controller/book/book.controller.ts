import { Controller, Post, Body } from '@nestjs/common';
import { AirBookService } from '../../services/air-book/air-book.service'

interface FlightSegment {
  FlightNumber: string;
  DepartureDateTime: string;
  ArrivalDateTime: string;
  JourneyDuration: string;
  MarketingAirline: string;
  DepartureAirport: string;
  ArrivalAirport: string;
  Prices: Price[];
}

interface Price {
  ResBookDesigCode: string;
  ResBookDesigQuantity: string;
  PassengerQuantity: string;
  AirPriceResponse: AirPriceResponse;
}

interface AirPriceResponse {
  baseFare: string;
  totalFare: string;
}

interface Passenger {
  name: string;
  lastname: string;
  gender: string;
  birthdate: string;
  expdocdate: string;
  identificationtype: string;
  identificationnumber: string;
  identificationcountry: string;
}

interface Contact {
  contactZoneCode: string;
  contactNumber: string;
  contactEmail: string;
  contactEmailConfirm: string;
}

interface BookingData {
  segmentFlight: FlightSegment[];
  passangers: Passenger[];
  contact: Contact;
}

@Controller('book')
export class BookController {
  constructor(
    private readonly airBookService: AirBookService
  ) {}

  @Post()
  async createBook(@Body() bookData: BookingData): Promise<any> {
    // Ahora puedes acceder a bookData.segmentFlight, bookData.passangers, y bookData.contact
    const jsonResponse = await this.airBookService.generateAndSendXml(bookData);
    return jsonResponse;
  }
}

