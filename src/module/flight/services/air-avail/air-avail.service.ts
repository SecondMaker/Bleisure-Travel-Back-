import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SharedService } from '../shared/shared.service';
import { ParseToJsonService } from '../parse-to-json/parse-to-json.service'
@Injectable()
export class AirAvailService {
  constructor( private sharedService: SharedService, private parseToJson: ParseToJsonService) {}
  async generateAndSendXml(travelData: any): Promise<string> {
    const user = this.sharedService.getUser();
    const password = this.sharedService.getPassword();
    const agentSine = this.sharedService.getAgentSine();
    const terminalID = this.sharedService.getTerminalID();
    const target = this.sharedService.getTarget();
    const ISOCountry = this.sharedService.getISOCountry();
    const xml = this.generateXml(travelData, agentSine, terminalID, target, ISOCountry).trim();

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const data = new URLSearchParams();
    data.append('user', user);
    data.append('password', password);
    data.append('request', xml); 

    try {
      const response = await axios.post('https://ssl00.kiusys.com/ws3/index.php', data.toString(), { headers });
      const jsonResponse = await this.parseToJson.parseXmlToJson(response.data);
      return  jsonResponse 
    } catch (error) {
      throw new Error('Error al enviar la solicitud al servicio web');
    }
  }

   generateXml(travelData: any, AgentSine: string, TerminalID: string, Target: string, ISOCountry: string): string {
    
     const xml = `
        <?xml version="1.0" encoding="UTF-8"?>
        <KIU_AirAvailRQ EchoToken="1" TimeStamp="2023-08-04T19:20:43+00:00" Target="${Target}" Version="3.0" SequenceNmbr="1" PrimaryLangID="en-us" DirectFlightsOnly="false" MaxResponses="10" CombinedItineraries="false">
         <POS>
            <Source AgentSine="${AgentSine}"  TerminalID="${TerminalID}" ISOCountry="${ISOCountry}" /> 
         </POS>
         <SpecificFlightInfo>   
         </SpecificFlightInfo>
         <OriginDestinationInformation>
            <DepartureDateTime>${travelData.fecha}</DepartureDateTime>
            <OriginLocation LocationCode="${travelData.origen}" />
            <DestinationLocation LocationCode="${travelData.destino}" />
         </OriginDestinationInformation> 
          <TravelPreferences MaxStopsQuantity="4">
            
         </TravelPreferences>
         <TravelerInfoSummary>
            <AirTravelerAvail>
               <PassengerTypeQuantity Code="ADT" Quantity="${travelData.cant}" />
            </AirTravelerAvail>
         </TravelerInfoSummary>
        </KIU_AirAvailRQ>
        `;
    return xml;
   }
}
