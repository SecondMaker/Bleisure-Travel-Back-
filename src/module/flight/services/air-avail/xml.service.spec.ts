import { Test, TestingModule } from '@nestjs/testing';
import { AirAvailService } from './air-avail.service';

describe('AirAvailService', () => {
  let service: AirAvailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirAvailService],
    }).compile();

    service = module.get<AirAvailService>(AirAvailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
