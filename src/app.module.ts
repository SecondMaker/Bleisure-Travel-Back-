import { Module, Logger } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino'; // Asegúrate de importar el módulo de registro LoggerModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { XmlGeneratorController } from './xml-generator/xml-generator.controller';
import { XmlService } from './xml-generator/xml.service';

@Module({
  imports: [    LoggerModule.forRoot(), ],
  controllers: [AppController, XmlGeneratorController],
  providers: [AppService, XmlService, Logger],
})
export class AppModule {}
