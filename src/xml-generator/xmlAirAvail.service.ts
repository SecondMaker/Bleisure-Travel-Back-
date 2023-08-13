import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { parseString } from 'xml2js';


@Injectable()
export class XmlService {
  constructor(private readonly logger: Logger) {}
  async generateAndSendXml(travelData: any): Promise<string> {
    // Generar el XML según los datos recibidos
    const xml = this.generateXml(travelData).trim();
    const user = 'BLEISURETRAVEL'; // Coloca esto en un archivo .env
    const password = 'na5!Z3Ew0bmId9oz'; // Coloca esto en un archivo .env

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
      const jsonResponse = await this.parseXmlToJson(response.data);
      return  jsonResponse 
    } catch (error) {
      throw new Error('Error al enviar la solicitud al servicio web');
    }
  }

   generateXml(travelData: any): string {

     const xml = `
        <?xml version="1.0" encoding="UTF-8"?>
        <KIU_AirAvailRQ EchoToken="1" TimeStamp="2023-08-04T19:20:43+00:00" Target="Testing" Version="3.0" SequenceNmbr="1" PrimaryLangID="en-us" DirectFlightsOnly="false" MaxResponses="10" CombinedItineraries="false">
         <POS>
            <Source AgentSine="MIAS90307" TerminalID="MIAS903008" ISOCountry="US" /> 
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
  
   async parseXmlToJson(xml: string): Promise<any> {
    return new Promise((resolve, reject) => {
      parseString(xml, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
   }
  
}
