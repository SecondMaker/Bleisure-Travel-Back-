import { IsEmail, IsNotEmpty, IsString, IsInt} from "class-validator"


export class BookingDto {
    
    @IsNotEmpty()
    codigo_reserva: string


    @IsNotEmpty()
    status: string

}