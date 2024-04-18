import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cron from 'cron';
import * as crypto from 'crypto';
import axios from 'axios';

type CronJobTick = () => Promise<void>;

@Injectable()
export class KeyUpdateService implements OnModuleInit {
  private aesKey: string = '';
  private urlBase: string = '';

  private cronJob: cron.CronJob<CronJobTick>;

  constructor(private config: ConfigService) {
    this.urlBase = this.config.get('URL_BNC');
  }

  getAESKey(): string {
    return this.aesKey;
  }

  async onModuleInit() {
    // Actualizar la clave AES cuando se levante la aplicación
    await this.updateAESKey();
    // Crear un nuevo CronJob para la actualización diaria
    this.cronJob = new cron.CronJob(
      '00 20 16 * * *',
      this.handleKeyUpdate.bind(this),
      null,
      true,
    );
  }
  private async handleKeyUpdate() {
    await this.updateAESKey();
  }
  private async updateAESKey() {
    // Lógica para obtener la clave AES desde el servicio externo
    const now = new Date();
    const currentTime = now.toLocaleString();
    try {
      // Comprueba si la aplicación está en modo de prueba
      const isTestMode = this.config.get<boolean>('TEST_MODE', false);
      if (isTestMode) {
        // Si estamos en modo de prueba, establece la clave de prueba
        this.aesKey = 'test_Key';
      } else {
        // Lógica normal para obtener la clave desde el servicio externo
        const response = await axios.post(`${this.urlBase}/Api/Auth/LogOn`, {
          ClientGUID: this.config.get('CLIENT_GUI'),
          Reference: '',
          Value: { ClientGUID: this.config.get('CLIENT_GUI') },
          Validation: this.calculateSHA256(this.config.get('CLIENT_GUI')),
          swTestOperation: false,
        });
        const workingKey =
          response.data &&
          response.data.value &&
          response.data.value.WorkingKey;
        if (workingKey) {
          this.aesKey = workingKey;
        } else {
          throw new Error(
            'Clave AES no encontrada en la respuesta del servicio externo',
          );
        }
      }
    } catch (error) {
      throw new Error(
        `Error al obtener la clave AES del servicio externo: ${error.message}`,
      );
    }

    console.log('Key Actualizada', currentTime, ' :::: ', this.aesKey);
  }
  private calculateSHA256(input: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(input);
    return hash.digest('hex');
  }
}
