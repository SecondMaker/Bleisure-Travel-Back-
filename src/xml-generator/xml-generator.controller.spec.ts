import { Test, TestingModule } from '@nestjs/testing';
import { XmlGeneratorController } from './xml-generator.controller';

describe('XmlGeneratorController', () => {
  let controller: XmlGeneratorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [XmlGeneratorController],
    }).compile();

    controller = module.get<XmlGeneratorController>(XmlGeneratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
