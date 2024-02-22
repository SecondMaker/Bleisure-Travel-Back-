import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(){
        super({
            datasources : {
                db: {
                    //url: 'mysql://root:root@localhost:3306/bleisure?schema=public'
                    url: 'mysql://doadmin:AVNS_y_AF5BN_Qw6nZRjR_uw@db-mysql-nyc3-49764-do-user-14593658-0.c.db.ondigitalocean.com:25060/defaultdb?ssl-mode=REQUIRED'
                }
              }
        })
    }
}
