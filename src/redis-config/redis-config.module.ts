import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CONNECTION',
      useFactory: (configService: ConfigService) => {
        if (configService.get<string>('PROD')) {
          console.log('on production!..');
          const redisUrl = configService.get<string>('REDISS_STRING');
          const redis = new Redis(redisUrl);
          return redis;
        } else {
          return new Redis({
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
          });
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CONNECTION'],
})
export class RedisModule {}
