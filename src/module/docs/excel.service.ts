import { Injectable, Req } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import * as XLSX from 'xlsx';
import {UploadedFile } from '@nestjs/common';
import { empty } from '@prisma/client/runtime/library';
import { ExcelDto } from "./dto/excel.dto";

@Injectable({})
export class ExcelService{
    constructor(
        private prisma: PrismaService,
        private config: ConfigService,

    ){}

    async search(@Req() req: any){
      console.log(req.query)
      const info_list = await this.prisma.excelDB.findFirst({     
        where: { 
                 iata: req.query.iata,
                 tarifa: req.query.tarifa,
                 destino: req.query.destino,
               },      
      });
      return {
        info_list
      }
    }


    async ExcelData(@Req() req: any) {
      const Bookings_list = await this.prisma.excelDB.findMany({
        select: {
          iata: true,
          tarifa: true,
          clasificacion: true,
          destino: true,
        },
    });
    
      return {Bookings_list}
    }

}