import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull'; // Importa BullModule
import { PaymentNotificationController } from './controller/payment/payment.controller';
import { BncLoginOnController } from './controller/bnc-login-on/bnc-login-on.controller';
import { BNCPaymentService } from './services/bnc.service';
import { KeyUpdateService } from '../../schedule/updateKey';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.registerQueue({
      name: 'payment-notifications', // Nombre de la cola de mensajes
    }),
  ],
  controllers: [PaymentNotificationController, BncLoginOnController],
  providers: [BNCPaymentService, KeyUpdateService],
})
export class PaymentModule {}
