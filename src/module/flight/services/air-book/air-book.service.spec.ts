import { Test, TestingModule } from '@nestjs/testing';
import { AirBookService } from './air-book.service';

describe('AirBookService', () => {
  let service: AirBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirBookService],
    }).compile();

    service = module.get<AirBookService>(AirBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
