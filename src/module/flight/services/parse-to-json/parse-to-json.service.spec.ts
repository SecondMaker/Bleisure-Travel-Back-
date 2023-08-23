import { Test, TestingModule } from '@nestjs/testing';
import { ParseToJsonService } from './parse-to-json.service';

describe('ParseToJsonService', () => {
  let service: ParseToJsonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParseToJsonService],
    }).compile();

    service = module.get<ParseToJsonService>(ParseToJsonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
