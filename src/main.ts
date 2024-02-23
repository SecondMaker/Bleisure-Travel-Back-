import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomExceptionFilter } from './filters/execption/execption.filter';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as cors from 'cors'; // Importa el módulo cors
import { ValidationPipe } from '@nestjs/common';
require('dotenv').config();

async function bootstrap() {
  const server = express();
  const allowedOrigins = ['http://localhost:3000', 'http://137.184.247.54', 'https://squid-app-84uyu.ondigitalocean.app'];
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server)
  );
  // Agrega esta línea para habilitar CORS
    // Agrega esta línea para habilitar CORS
    app.use(cors({
      origin: allowedOrigins, // Cambia esto al dominio correcto de tu frontend
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    }));
  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalPipes(new ValidationPipe
    ({
      whitelist: true,
    }),
    );
  await app.listen(8080);
}
bootstrap();