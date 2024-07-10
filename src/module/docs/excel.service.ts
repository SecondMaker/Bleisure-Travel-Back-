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
      const info_list = await this.prisma.excelDB.findFirst({
        where: { 
                 iata: req.body.iata,
                 tarifa: req.body.tarifa,
                 destino: req.body.destino,
               },      
      });
      return {
        info_list
      }
    }
}