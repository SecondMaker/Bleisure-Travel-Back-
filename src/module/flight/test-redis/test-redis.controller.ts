import { Controller, Post, Body, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Controller()
export class TestRedisController {
 // constructor(@Inject('REDIS_CONNECTION') private readonly redisClient: Redis) {}

  @Post('save-to-redis')
  async saveToRedis(
    @Body('key') key: string,
    @Body('value') value: string,
  ): Promise<any> {
    //await this.redisClient.set(key, value);
    return 'Data saved to Redis';
  }
}