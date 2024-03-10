import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
//controllers

//services

//config

@Module({
  imports: [
    ConfigModule.forRoot(),
    //RedisModule, // Asegúrate de importar el RedisModule aquí
  ],
  controllers: [

  ],
  providers: [

  ],
})
export class PaymentModule {}
