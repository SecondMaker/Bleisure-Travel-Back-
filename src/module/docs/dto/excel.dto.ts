import { IsNotEmpty } from "class-validator";

export class ExcelDto {
    @IsNotEmpty()
    ruta: string; 

    @IsNotEmpty()
    iata: string;

    @IsNotEmpty()
    tarifa: string;
}