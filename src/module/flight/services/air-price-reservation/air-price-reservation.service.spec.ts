import { Test, TestingModule } from '@nestjs/testing';
import { AirPriceReservationService } from './air-price-reservation.service';

describe('AirPriceReservationService', () => {
  let service: AirPriceReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirPriceReservationService],
    }).compile();

    service = module.get<AirPriceReservationService>(AirPriceReservationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
