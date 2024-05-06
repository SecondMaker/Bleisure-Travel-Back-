import { Body, Controller, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { BNCPaymentService } from '../../services/bnc.service'; // Importa el servicio
import { PaymentData } from '../../model';

@Controller('payments')
export class PaymentNotificationController {
  constructor(
    @InjectQueue('payment-notifications') private readonly queue: Queue,
    private readonly bncPaymentService: BNCPaymentService, // Inyecta el servicio
  ) {}

  @Post()
  async notifyPayment(@Body() payment: PaymentData): Promise<string | null> {
    // Cambia el tipo de retorno a string o null
    let attempts = 0;
    let hash: string | null = null;
    let response: any;

    // Realiza un bucle hasta que se obtenga una respuesta exitosa o se alcance un número máximo de intentos
    while (attempts < 5 && hash === null) {
      const isPaymentSuccessful = await this.bncPaymentService.processPayment(
        payment,
      );

      if (isPaymentSuccessful) {
        // Si el pago es exitoso, calcula el hash y rompe el bucle
        response = isPaymentSuccessful;
      } else {
        // Si el pago falla, incrementa el número de intentos
        attempts++;
        console.error(`El pago ha fallado, intento número ${attempts}`);
        // Puedes manejar el reintentar el pago aquí si es necesario
      }
    }

    // Devuelve el hash si se ha obtenido, de lo contrario, devuelve null
    return response;
  }

  @Post('test')
  async testBNC (@Body() payment: any) : Promise<string | null>{


    const isPaymentSuccessful = await this.bncPaymentService.testServices(
      payment
    )

    return isPaymentSuccessful
  }
}
