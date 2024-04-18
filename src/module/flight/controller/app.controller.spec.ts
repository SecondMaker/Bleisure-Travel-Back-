import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { XmlService } from '../services/air-avail/air-avail.service';

describe('AppController', () => {
  let appController: AppController;
  let xmlService: XmlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [XmlService],
    }).compile();

    appController = module.get<AppController>(AppController);
    xmlService = module.get<XmlService>(XmlService);
  });

  describe('receiveData', () => {
    it('should generate and send XML', async () => {
      const generateAndSendXmlSpy = jest
        .spyOn(xmlService, 'generateAndSendXml')
        .mockResolvedValue('');

      const fecha = '2023-08-15';
      const origen = 'CCS';
      const destino = 'PMV';
      const cant = 1;

      const result = await appController.receiveData(
        fecha,
        origen,
        destino,
        cant,
      );

      expect(generateAndSendXmlSpy).toHaveBeenCalledWith({
        fecha,
        origen,
        destino,
        cant,
      });
      expect(result).toEqual({
        /* Expected response */
      });
    });
  });
});
