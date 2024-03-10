import { Injectable } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
@Controller('payments')
export class PaymentNotificationController {
  constructor(
    @InjectQueue('payment-notifications') private readonly queue: Queue,
  ) {}

  @Post()
  async notifyPayment(@Body() payment: { id: number; payment: any }): Promise<void> {
    
    const job = await this.queue.add('payment-notification', payment);

    while (true) {
      const result = await job.finished();

      if (result.success) {
        // Notificación exitosa, no se requiere reintento
        break;
      } else {
        // Error en la notificación, se reintentará
        console.error(`Error al notificar el pago: ${result.error}`);
        await job.retry();
      }
    }
  }
}