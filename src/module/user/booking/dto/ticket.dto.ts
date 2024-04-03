import { IsEmail, IsNotEmpty, IsString, IsInt, Allow} from "class-validator"


export class TicketDto {
    
    @Allow()
    codigo_reserva: string

    @Allow()
    status: string

    @Allow()
    montoTotal: string

    @Allow()
    montoAbonado: string

    @Allow()
    codigoTicket: string

}