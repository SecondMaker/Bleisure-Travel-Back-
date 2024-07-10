import { IsNotEmpty } from "class-validator";

export class ExcelDto {
    @IsNotEmpty()
    iata: string; 

    @IsNotEmpty()
    tarifa: string;

    @IsNotEmpty()
    destino: string;
}