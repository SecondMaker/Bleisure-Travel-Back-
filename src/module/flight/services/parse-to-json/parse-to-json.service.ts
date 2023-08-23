import { Injectable } from '@nestjs/common';
import { parseString } from 'xml2js';

@Injectable()
export class ParseToJsonService {
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
