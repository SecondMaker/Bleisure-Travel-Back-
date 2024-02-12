import { Controller, Post, Body } from '@nestjs/common';
import { AirTicketService } from '../../services/air-ticket/air-ticket.service';
import { AirPriceReservationService } from '../../services/air-price-reservation/air-price-reservation.service';

@Controller('ticket')
export class TicketController {
  constructor(
    private readonly airTicketService: AirTicketService,
    private readonly airPriceReservation: AirPriceReservationService,
  ) {}

  @Post()
  async createBook(@Body() reservationData: any): Promise<any> {
    try {
      // Llama al servicio que reserva el precio..
      const priceResponse = await this.airPriceReservation.generateAndSendXml(
        reservationData.reservationID,
      );
      const success = await this.validatePriceResponse(priceResponse)
      if (success) {
        //llama al servicio que genera el ticket..
        const ticketResponse = await this.airTicketService.generateAndSendXml(
          reservationData.reservationID,
          reservationData.MarketingAirline
        )
        return ticketResponse

      } else { 
        const Error = await this.getErrorPrice(priceResponse)
        return  Error
      } 
    } catch (error) {
      
      
    }
  }
  async validatePriceResponse(priceResponse: any) {
    const KIUrs= priceResponse.KIU_AirPriceRS
    if (KIUrs.Success == undefined) {
      return false
    } else {
      return true
    }
  }
  async getErrorPrice(priceResponse: any) {
    return priceResponse.KIU_AirPriceRS.Error[0]
  }
}
