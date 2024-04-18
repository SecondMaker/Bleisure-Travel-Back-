import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SharedService } from '../shared/shared.service';
import { ParseToJsonService } from '../parse-to-json/parse-to-json.service';
@Injectable()
export class AirTicketService {
  constructor(
    private sharedService: SharedService,
    private parseToJson: ParseToJsonService,
  ) {}

  async generateAndSendXml(BookingID: any, Airline: any): Promise<string> {
    const user = this.sharedService.getUser();
    const password = this.sharedService.getPassword();
    const agentSine = this.sharedService.getAgentSine();
    const terminalID = this.sharedService.getTerminalID();
    const target = this.sharedService.getTarget();
    const ISOCountry = this.sharedService.getISOCountry();

    const xml = this.generateXml(
      BookingID,
      Airline,
      agentSine,
      terminalID,
      target,
      ISOCountry,
    ).trim();

    console.log(xml);
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
      // Convierte la respuesta XML en formato JSON
      const jsonResponse = await this.parseToJson.parseXmlToJson(response.data);

      return jsonResponse;
    } catch (error) {
      throw new Error('Error al enviar la solicitud al servicio web');
    }
  }

  generateXml(
    BookingID: any,
    Airline: any,
    AgentSine: string,
    TerminalID: string,
    Target: string,
    ISOCountry: string,
  ): string {
    const xml = `
        <KIU_AirDemandTicketV2RQ
        xmlns:ns="http://www.opentravel.org/OTA/2003/05/common"
          xmlns:vc="http://www.w3.org/2007/XMLSchema-versioning"
          xmlns:sch="http://purl.oclc.org/dsdl/schematron"
          xmlns:fn="http://www.w3.org/2005/xpath-functions"
          xmlns="http://www.opentravel.org/OTA/2003/05"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.opentravel.org/OTA/2003/05"
          EchoToken="EXAMPLEDEMANDTICKETV2" TimeStamp="2021-12-27T13:10:00" Target="${Target}" Version="3.1" SequenceNmbr="1" PrimaryLangID="en-US">
               <POS>
                  <Source AgentSine="${AgentSine}" TerminalID="${TerminalID}" ISOCountry="${ISOCountry}"  ISOCurrency="USD">
                        <RequestorID Type="5" />
                        <BookingChannel Type="1" />
                    </Source>
                </POS>
                <DemandTicketDetail>
                    <BookingReference ID="${BookingID}" />
                    <ValidatingCarrierInfo Carrier="${Airline}"/>
                    <PaymentInfo PaymentType="1" PaymentRPH="1"></PaymentInfo>
                    <Endorsement Info="NONEND/NONREF"/>
                    <FlightReference SegmentRPHNumber="1" RangePosition="Last"/>
                </DemandTicketDetail>
            </KIU_AirDemandTicketV2RQ>           
               `;

    return xml;
  }
}
