import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SharedService } from '../shared/shared.service';
import { ParseToJsonService } from '../parse-to-json/parse-to-json.service'
@Injectable()
export class AirPriceService {
    constructor(private sharedService: SharedService, private parseToJson: ParseToJsonService) { }
   async generateAndSendXml(flightData: any): Promise<string> {
        const user = this.sharedService.getUser();
        const password = this.sharedService.getPassword();
        const agentSine = this.sharedService.getAgentSine();
        const terminalID = this.sharedService.getTerminalID();
        const target = this.sharedService.getTarget();
        const ISOCountry = this.sharedService.getISOCountry();
        const xml = this.generateXml(flightData, agentSine, terminalID, target, ISOCountry).trim();
    
        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
        };
        const data = new URLSearchParams();
        data.append('user', user);
        data.append('password', password);
        data.append('request', xml); 
    
        try {
          const response = await axios.post('https://ssl00.kiusys.com/ws3/index.php', data.toString(), { headers });
          // Convierte la respuesta XML en formato JSON
          const jsonResponse = await this.parseToJson.parseXmlToJson(response.data);
          return  jsonResponse 
        } catch (error) {
          throw new Error('Error al enviar la solicitud al servicio web');
        }
    }
    
    generateXml(flightData: any, AgentSine: string, TerminalID: string, Target: string, ISOCountry: string): string {
    
        const xml = `
        <?xml version="1.0" encoding="UTF-8"?>
        <KIU_AirPriceRQ EchoToken="WS3DOCEXAMPLE" TimeStamp="2023-08-07T18:05:00+00:00" Target="${Target}" Version="3.0" SequenceNmbr="1" PrimaryLangID="en-us">
           <POS>
              <Source AgentSine="${AgentSine}" TerminalID="${TerminalID}" ISOCountry="${ISOCountry}"  ISOCurrency="USD">
                    <RequestorID Type="5" />
                    <BookingChannel Type="1" />
                </Source>
            </POS>
           <AirItinerary>
              <OriginDestinationOptions>
                 <OriginDestinationOption>
                    <FlightSegment  DepartureDateTime="${flightData.DepartureDateTime}" ArrivalDateTime="${flightData.ArrivalDateTime}"  FlightNumber="${flightData.FlightNumber}" ResBookDesigCode="${flightData.ResBookDesigCode}" >
                       <DepartureAirport LocationCode="${flightData.DepartureAirport}" />
                       <ArrivalAirport LocationCode="${flightData.ArrivalAirport}" />
                       <MarketingAirline Code="${flightData.MarketingAirline}" />
                    </FlightSegment>
                 </OriginDestinationOption>
              </OriginDestinationOptions>
           </AirItinerary>
           <TravelerInfoSummary>
              <AirTravelerAvail>
                 <PassengerTypeQuantity Code="ADT" Quantity="${flightData.PassengerQuantity}" />
              </AirTravelerAvail>
           </TravelerInfoSummary>
        </KIU_AirPriceRQ>           
           `;
       return xml;
      } 
}
