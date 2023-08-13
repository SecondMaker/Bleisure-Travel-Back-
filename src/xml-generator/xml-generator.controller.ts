import { Body, Controller, Post } from '@nestjs/common';
import { XmlService } from './xmlAirAvail.service';

@Controller('xml-generator')
export class XmlGeneratorController {
    constructor(private readonly xmlService: XmlService) {}

    @Post()
    async generateXml(@Body() travelData: any): Promise<string> {
      const xml = this.xmlService.generateXml(travelData);
      // Aquí debes implementar el código para enviar el XML al servicio web.
      // Puedes utilizar bibliotecas como 'axios' o el módulo 'http' de Node.js.
      return xml;
    }
}
