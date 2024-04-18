import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import axios, { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { KeyUpdateService } from '../../../schedule/updateKey';

@Injectable()
export class BNCPaymentService {
  private attempts: number = 0;
  private urlBase: string = '';
  private clientGUID: string;

  constructor(
    private config: ConfigService,
    private keyService: KeyUpdateService,
  ) {
    this.clientGUID = this.config.get('CLIENT_GUI');
    this.urlBase = this.config.get('URL_BNC');
  }

  async processPayment(paymentData: any): Promise<{
    ClientGUID: string;
    Reference: string;
    Value: string;
    Validation: string;
    swTestOperation: boolean;
  } | null> {
    this.attempts++;
    if (this.attempts < 5) {
      // Simula una respuesta fallida
      return null;
    } else {
      // En la quinta vez, simula una respuesta exitosa y devuelve el hash SHA256 y el texto cifrado con AES
      this.attempts = 0; // Reinicia los intentos para futuros pagos

      const validation = this.calculateSHA256(JSON.stringify(paymentData));
      const value = this.encryptAES(JSON.stringify(paymentData));

      return {
        ClientGUID: this.clientGUID,
        Reference: '',
        Value: value,
        Validation: validation,
        swTestOperation: false,
      };
    }
  }

  // Función para calcular el hash SHA256 de una cadena
  private calculateSHA256(input: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(input);
    return hash.digest('hex');
  }

  // Función para cifrar datos utilizando AES
  private encryptAES(data: string): string {
    const key = this.keyService.getAESKey();
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
}
