import { Test, TestingModule } from '@nestjs/testing';
import {PaymentNotificationController } from './payment.controller';

describe('PaymentController', () => {
  let controller: PaymentNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentNotificationController],
    }).compile();

    controller = module.get<PaymentNotificationController>(PaymentNotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
