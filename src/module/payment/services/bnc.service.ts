import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class BNCPaymentService {
  private attempts: number = 0;
  private readonly aesKey: string = 'mySecretKey'; // Clave secreta para AES
  private readonly clientGUID: string = '4A074C46-DD4E-4E54-8010-B80A6A8758F4'; // Constante para ClientGUID

  async processPayment(paymentData: any): Promise<{ ClientGUID: string; Reference: string; Value: string; Validation: string; swTestOperation: boolean } | null> {
    this.attempts++;
    if (this.attempts < 5) {
      // Simula una respuesta fallida
      return null;
    } else {
      // En la quinta vez, simula una respuesta exitosa y devuelve el hash SHA256 y el texto cifrado con AES
      this.attempts = 0; // Reinicia los intentos para futuros pagos

      const validation = this.calculateSHA256(JSON.stringify(paymentData));
      const value = this.encryptAES(JSON.stringify(paymentData));

      console.log('Hash SHA256:', validation); // Imprime el hash en la consola
      console.log('Texto cifrado con AES:', value); // Imprime el texto cifrado con AES en la consola
      
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
    const cipher = crypto.createCipher('aes-256-cbc', this.aesKey);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }



}
