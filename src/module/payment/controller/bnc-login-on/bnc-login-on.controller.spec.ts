import { Test, TestingModule } from '@nestjs/testing';
import { BncLoginOnController } from './bnc-login-on.controller';

describe('BncLoginOnController', () => {
  let controller: BncLoginOnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BncLoginOnController],
    }).compile();

    controller = module.get<BncLoginOnController>(BncLoginOnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
