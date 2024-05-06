import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { KeyUpdateService } from '../../../schedule/updateKey';
import { Cypher } from './cypherData';

@Injectable()
export class BNCPaymentService {
  private attempts: number = 0;
  private urlBase: string = '';
  private clientGUID: string;

  constructor(
    private config: ConfigService,
    private cypher: Cypher
  ) {
    this.clientGUID = this.config.get('CLIENT_GUI');
    this.urlBase = this.config.get('URL_BNC');
  }
  
 async testServices(data: any): Promise<any> {
  
  const validation = this.cypher.calculateSHA256(JSON.stringify(this.clientGUID));

  const send = {
    ClientGUID: this.clientGUID,
    Reference: '',
    Value: {"ClientGUID":this.clientGUID},
    Validation: validation,
    swTestOperation: false,
  }
  
  return send
 }

  async processPayment(paymentData: any): Promise<any> {
    this.attempts++;
    if (this.attempts < 5) {
      // Simula una respuesta fallida
      return null;
    } else {
      // En la quinta vez, simula una respuesta exitosa y devuelve el hash SHA256 y el texto cifrado con AES
      this.attempts = 0; // Reinicia los intentos para futuros pagos

      const validation = this.cypher.calculateSHA256(JSON.stringify(paymentData));
      const value = this.cypher.encryptAES(JSON.stringify(paymentData));

      const data = {
        ClientGUID: this.clientGUID,
        Reference: '',
        Value: value,
        Validation: validation,
        swTestOperation: false,
      }
      
      return data

     // return await axios.post(`${this.urlBase}/Api/Auth/LogOn`, data );
     /* try {
        const response = await axios.post(
          `${this.urlBase}/Api/Position/ValidateP2P`,
          data
        );
          
        return response;
      } catch (error) {
        throw new Error(error);
      }
        */
    }
  }
}
