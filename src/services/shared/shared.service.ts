// shared.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SharedService {
  constructor(private configService: ConfigService) {}

  getUser(): string {
    return this.configService.get<string>('USER');
  }

  getPassword(): string {
    return this.configService.get<string>('PASSWORD');
  }

  getAgentSine(): string {
    return this.configService.get<string>('AGENT_SINE');
  }

  getTerminalID(): string {
    return this.configService.get<string>('TERMINAL_ID');
  }

  getTarget(): string {
    return this.configService.get<string>('TARGET');
  }
    
    getISOCountry(): string {
      return this.configService.get<string>('ISOCOUNTRY')
  }  
}
