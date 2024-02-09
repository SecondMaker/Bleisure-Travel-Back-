import { Test, TestingModule } from '@nestjs/testing';
import { AirTicketService } from './air-ticket.service';

describe('AirTicketService', () => {
  let service: AirTicketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirTicketService],
    }).compile();

    service = module.get<AirTicketService>(AirTicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
