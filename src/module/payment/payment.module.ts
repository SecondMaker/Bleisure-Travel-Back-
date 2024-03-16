import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull'; // Importa BullModule
import { PaymentNotificationController } from './controller/payment/payment.controller';
import { BNCPaymentService } from './services/bnc.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.registerQueue({
      name: 'payment-notifications', // Nombre de la cola de mensajes
    }),
  ],
  controllers: [PaymentNotificationController],
  providers: [BNCPaymentService],
})
export class PaymentModule {}