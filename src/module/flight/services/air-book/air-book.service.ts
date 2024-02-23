import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SharedService } from '../shared/shared.service';
import { ParseToJsonService } from '../parse-to-json/parse-to-json.service';

@Injectable()
export class AirBookService {
  constructor(
    private sharedService: SharedService,
    private parseToJson: ParseToJsonService,
  ) {}

  async generateAndSendXml(bookData: any): Promise<any> {
    const user = this.sharedService.getUser();
    const password = this.sharedService.getPassword();
    const agentSine = this.sharedService.getAgentSine();
    const terminalID = this.sharedService.getTerminalID();
    const target = this.sharedService.getTarget();
    const ISOCountry = this.sharedService.getISOCountry();
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 24);
    const TicketTimeLimit = currentDate
      .toISOString()
      .slice(0, 19);

    const xml = this.generateXml(
      bookData,
      agentSine,
      terminalID,
      target,
      ISOCountry,
      TicketTimeLimit
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
       
       const Data = {
         json: jsonResponse,
         req: xml
       }
      return jsonResponse
     } catch (error) {
       
      throw new Error('Error al enviar la solicitud al servicio web');
    } 
  }
  formatDateTime(dateTime: string): string {
    // Convierte "2024-01-27 21:30:00" a "2024-01-27T21:30:00"
    return dateTime.replace(' ', 'T');
  }

  generateXml(
    bookData: any,
    AgentSine: string,
    TerminalID: string,
    Target: string,
    ISOCountry: string,
    TicketTimeLimit: string
  ): string {
    const originDestinationOptionsXml = bookData.segmentFlight
      .map(
        (flight, index) => `
          <OriginDestinationOption>
              <FlightSegment DepartureDateTime="${this.formatDateTime(
                flight.DepartureDateTime
              )}" ResBookDesigCode="${
          flight.Prices[0].ResBookDesigCode
        }" SegmentRPH="${index + 1}" FlightNumber="${flight.FlightNumber}">
                  <DepartureAirport LocationCode="${flight.DepartureAirport}"/>
                  <ArrivalAirport LocationCode="${flight.ArrivalAirport}"/>
                  <MarketingAirline Code="${flight.MarketingAirline}"/>
              </FlightSegment>
          </OriginDestinationOption>
      `,
      )
      .join('');

    const AirTravelerXml = bookData.passangers
      .map(
        (passanger, index) => `
        <AirTraveler>
        <PersonName PTC="ADT">
          <NamePrefix>${
            passanger.gender === 'female' ? 'MS' : 'MR'
          }</NamePrefix>
          <GivenName>${passanger.name.toUpperCase()}</GivenName>
          <MiddleName>O</MiddleName>
          <Surname>${passanger.lastname.toUpperCase()}</Surname>
        </PersonName>
        <Document DocType="${passanger.identificationtype.toUpperCase()}" DocID="${passanger.identificationnumber}"/>
        <Telephone CountryAccessCode="${bookData.contact.contactZoneCode.replace(
          /\D/g,
          '',
          )}" AreaCityCode="424" PhoneNumber="${bookData.contact.contactNumber}"/>
        <Email>juansala@gmail.com</Email>
        <TravelerRefNumber RPH="1"/>
      </AirTraveler>
      `,
      )
      .join('');
    const xml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <KIU_AirBookV2RQ
        xmlns:ns="http://www.opentravel.org/OTA/2003/05/common"
        xmlns:vc="http://www.w3.org/2007/XMLSchema-versioning"
        xmlns:sch="http://purl.oclc.org/dsdl/schematron"
        xmlns:fn="http://www.w3.org/2005/xpath-functions"
        xmlns="http://www.opentravel.org/OTA/2003/05"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.opentravel.org/OTA/2003/05"
        EchoToken="GERTESTWS3DOCS"
        TimeStamp="2023-12-20T04:16:28+00:00"
        Target="${Target}" 
        Version="3.0" 
        SequenceNmbr="1"
        >
        <POS>
          <Source 
            AgentSine="${AgentSine}" 
            TerminalID="${TerminalID}" 
            ISOCountry="${ISOCountry}" 
            ISOCurrency="USD">
              <RequestorID Type="5" />
              <BookingChannel Type="1" />
          </Source>
        </POS>
        <AirItinerary>
          <OriginDestinationOptions>
            ${originDestinationOptionsXml}
          </OriginDestinationOptions>
        </AirItinerary>
        <TravelerInfo>
          ${AirTravelerXml}
        </TravelerInfo>
        <Ticketing CancelOnExpiryInd="true" TicketTimeLimit="${TicketTimeLimit}" TimeLimitCity="CCS"/>
      </KIU_AirBookV2RQ>
    `;

    return xml;
  }
}
