import { IsEmail, IsNotEmpty, IsString, IsInt, Allow} from "class-validator"


export class BookingDto {
    
    @IsNotEmpty()
    codigo_reserva: string


    @IsNotEmpty()
    status: string

    @Allow()
    montoTotal: string

    @Allow()
    montoAbonado: string

    @Allow()
    codigoTicket: string

}