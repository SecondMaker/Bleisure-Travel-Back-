import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService){
        super({
            datasources : {
                db: {
                    url: config.get('DATABASE_URL')
                    //url: 'mysql://doadmin:AVNS_y_AF5BN_Qw6nZRjR_uw@db-mysql-nyc3-49764-do-user-14593658-0.c.db.ondigitalocean.com:25060/defaultdb?ssl-mode=REQUIRED'
                }
              }
        })
    }
}
