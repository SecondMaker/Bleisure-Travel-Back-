import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { KeyUpdateService } from '../../../schedule/updateKey';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Cypher {

  constructor(
    private config: ConfigService,
    private keyService: KeyUpdateService,
  ) {}

  calculateSHA256(input: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(input);
    return hash.digest('hex');
  }

  // Función para cifrar datos utilizando AES
  encryptAES(data: string): string {
    const key = this.keyService.getAESKey();
    //console.log("secret key",key)
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
}
