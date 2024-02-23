import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SharedService } from '../shared/shared.service';
import { ParseToJsonService } from '../parse-to-json/parse-to-json.service'
@Injectable()
export class AirPriceService {
    constructor(private sharedService: SharedService, private parseToJson: ParseToJsonService) { }
   async generateAndSendXml(flightData: any, priceData: any): Promise<string> {
        const user = this.sharedService.getUser();
        const password = this.sharedService.getPassword();
        const agentSine = this.sharedService.getAgentSine();
        const terminalID = this.sharedService.getTerminalID();
        const target = this.sharedService.getTarget();
        const ISOCountry = this.sharedService.getISOCountry();
        const xml = this.generateXml(flightData, priceData, agentSine, terminalID, target, ISOCountry).trim();
    
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
    
   generateXml(flightData: any, priceData: any, AgentSine: string, TerminalID: string, Target: string, ISOCountry: string): string {

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
                    <FlightSegment  DepartureDateTime="${flightData.flightData.DepartureDateTime}" ArrivalDateTime="${flightData.flightData.ArrivalDateTime}"  FlightNumber="${flightData.flightData.FlightNumber}" ResBookDesigCode="${priceData.priceData.ResBookDesigCode}" >
                       <DepartureAirport LocationCode="${flightData.flightData.DepartureAirport}" />
                       <ArrivalAirport LocationCode="${flightData.flightData.ArrivalAirport}" />
                       <MarketingAirline Code="${flightData.flightData.MarketingAirline}" />
                    </FlightSegment>
                 </OriginDestinationOption>
              </OriginDestinationOptions>
           </AirItinerary>
           <TravelerInfoSummary>
              <AirTravelerAvail>
                 ${priceData.priceData.adt ? `<PassengerTypeQuantity Code="ADT" Quantity="${priceData.priceData.adt}" />` : ''}
                 ${priceData.priceData.chd && priceData.priceData.chd > 0 ? `<PassengerTypeQuantity Code="CHD" Quantity="${priceData.priceData.chd}" />` : ''}
                 ${priceData.priceData.inf && priceData.priceData.inf > 0 ? `<PassengerTypeQuantity Code="INF" Quantity="${priceData.priceData.inf}" />` : ''}
              </AirTravelerAvail>
           </TravelerInfoSummary>
        </KIU_AirPriceRQ>           
           `;

       return xml;
      } 
}
