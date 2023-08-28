import { Module } from '@nestjs/common';
import  Redis from 'ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CONNECTION',
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          // Agrega otras opciones de configuración según tus necesidades
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CONNECTION'],
})
export class RedisModule {}
