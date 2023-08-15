import { Test, TestingModule } from '@nestjs/testing';
import { AirPriceService } from './air-price.service';

describe('AirPriceService', () => {
  let service: AirPriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirPriceService],
    }).compile();

    service = module.get<AirPriceService>(AirPriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
