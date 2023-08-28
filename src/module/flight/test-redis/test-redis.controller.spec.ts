import { Test, TestingModule } from '@nestjs/testing';
import { TestRedisController } from './test-redis.controller';

describe('TestRedisController', () => {
  let controller: TestRedisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestRedisController],
    }).compile();

    controller = module.get<TestRedisController>(TestRedisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
