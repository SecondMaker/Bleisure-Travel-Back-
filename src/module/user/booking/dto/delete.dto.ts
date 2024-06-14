import { IsNotEmpty,  } from "class-validator";
import internal from "stream";

export class DeleteTicketDto {
    @IsNotEmpty()
    codigo_reserva: string
}