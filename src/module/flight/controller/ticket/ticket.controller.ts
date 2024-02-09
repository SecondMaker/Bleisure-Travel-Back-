import { Controller, Post, Body } from '@nestjs/common';
import { AirTicketService } from '../../services/air-ticket/air-ticket.service'
import { AirPriceReservationService } from '../../services/air-price-reservation/air-price-reservation.service';

@Controller('ticket')
export class TicketController { 

    constructor(
      private readonly airTicketService: AirTicketService,
      private readonly airPriceReservation: AirPriceReservationService
      ) {}
    
      @Post()
      async createBook(@Body() reservationData: any): Promise<any> {    
        console.log("reservation:::",reservationData.reservationID)
        const jsonResponse = this.airPriceReservation.generateAndSendXml(reservationData.reservationID)

        
        return jsonResponse;
      }
}


