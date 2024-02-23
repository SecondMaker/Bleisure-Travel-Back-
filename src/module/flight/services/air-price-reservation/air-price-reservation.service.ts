import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SharedService } from '../shared/shared.service';
import { ParseToJsonService } from '../parse-to-json/parse-to-json.service';

@Injectable()
export class AirPriceReservationService {
  constructor(
    private sharedService: SharedService,
    private parseToJson: ParseToJsonService,
  ) {}

  async generateAndSendXml(BookingID: any): Promise<string> {
    const user = this.sharedService.getUser();
    const password = this.sharedService.getPassword();
    const agentSine = this.sharedService.getAgentSine();
    const terminalID = this.sharedService.getTerminalID();
    const target = this.sharedService.getTarget();
    const ISOCountry = this.sharedService.getISOCountry();

    const xml = this.generateXml(
      BookingID,
      agentSine,
      terminalID,
      target,
      ISOCountry,
    ).trim();

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const data = new URLSearchParams();
    data.append('user', user);
    data.append('password', password);
    data.append('request', xml);

      try {
        console.log(xml)
      const response = await axios.post(
        'https://ssl00.kiusys.com/ws3/index.php',
        data.toString(),
        { headers },
      );
      // Convierte la respuesta XML en formato JSON
      const jsonResponse = await this.parseToJson.parseXmlToJson(response.data);

      return jsonResponse;
    } catch (error) {
      throw new Error('Error al enviar la solicitud al servicio web');
    }
  }

  generateXml(
    BookingID: any,
    AgentSine: string,
    TerminalID: string,
    Target: string,
    ISOCountry: string,
  ): string {
    const xml = `
        <?xml version="1.0" encoding="UTF-8"?>
        <KIU_AirPriceRQ EchoToken="WS3DOCEXAMPLE" TimeStamp="2023-08-07T18:05:00+00:00" Target="${Target}" Version="3.0" SequenceNmbr="1" PrimaryLangID="en-us" Type="Reprice" IncludeAncillaries="true">
           <POS>
              <Source AgentSine="${AgentSine}" TerminalID="${TerminalID}" ISOCountry="${ISOCountry}"  ISOCurrency="USD">
                    <RequestorID Type="5" />
                    <BookingChannel Type="1" />
                </Source>
            </POS>
            <BookingReferenceID ID="${BookingID}" />
        </KIU_AirPriceRQ>           
           `;

    return xml;
  }
}
