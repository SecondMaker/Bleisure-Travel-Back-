import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SharedService } from '../shared/shared.service';
import { ParseToJsonService } from '../parse-to-json/parse-to-json.service';
@Injectable()
export class destinationService {
  constructor(
    private sharedService: SharedService,
    private parseToJson: ParseToJsonService,
  ) {}
  async generateAndSendXml(airLine: string): Promise<string> {
    const user = this.sharedService.getUser();
    const password = this.sharedService.getPassword();
    const agentSine = this.sharedService.getAgentSine();
    const terminalID = this.sharedService.getTerminalID();
    const target = this.sharedService.getTarget();
    const ISOCountry = this.sharedService.getISOCountry();
    const xml = this.generateXml(
      airLine,
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
      const response = await axios.post(
        'https://ssl00.kiusys.com/ws3/index.php',
        data.toString(),
        { headers },
      );
      const jsonResponse = await this.parseToJson.parseXmlToJson(response.data);
      return jsonResponse;
    } catch (error) {
      throw new Error('Error al enviar la solicitud al servicio web');
    }
  }

  generateXml(
    airLine: string,
    AgentSine: string,
    TerminalID: string,
    Target: string,
    ISOCountry: string,
  ): string {
    const xml = `
         <?xml version="1.0" encoding="UTF-8"?>
         <KIU_GetOriginDestinationInfoRQ EchoToken="1" TimeStamp="2019-09-09T17:17:36+00:00" Target="${Target}" Version="3.0" SequenceNmbr="1" PrimaryLangID="en-us">
             <POS>
               <Source AgentSine="${AgentSine}" TerminalID="${TerminalID}" ISOCountry="${ISOCountry}" ISOCurrency="USD">
               </Source>
         </POS> 
            <RequestedCarrier> <CarrierCode>${airLine}</CarrierCode>
             </RequestedCarrier>
         </KIU_GetOriginDestinationInfoRQ>
        `;
    return xml;
  }
}
