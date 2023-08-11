// app.controller.ts
import { Controller, Post, Body} from '@nestjs/common';
import { XmlService } from './xml-generator/xml.service';

@Controller()
export class AppController {
  constructor(private readonly xmlService: XmlService) {}

  @Post('search')
  async receiveData(
    @Body('fecha') fecha: string,
    @Body('origen') origen: string,
    @Body('destino') destino: string,
    @Body('cant') cant: number,
  ): Promise<any> {
    const response = {
      message: 'Datos recibidos',
      fecha,
      origen,
      destino,
      cant,
    };

    // Llama al servicio XmlService para generar y enviar el XML
    const generatedXmlResponse = await this.xmlService.generateAndSendXml({
      fecha,
      origen,
      destino,
      cant: cant, // Asegúrate de usar la misma nomenclatura de propiedades
    });

    return generatedXmlResponse;
  }
}
