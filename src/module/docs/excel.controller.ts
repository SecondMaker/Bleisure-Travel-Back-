import { Controller, Post, UseInterceptors, UploadedFile, ForbiddenException, Get, Req, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaClientKnownRequestError, empty } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExcelService } from './excel.service';
import * as XLSX from 'xlsx';
import { ExcelDto } from './dto/excel.dto';

@Controller('upload')
export class UploadController {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private ExcelService: ExcelService,
){}
  @Post('excel')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    try{
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet); 
      const exceldelete = await this.prisma.excelDB.deleteMany({})
      console.log(data[0])
      for (let i = 0; i < data.length; i++) {
          const save = await this.prisma.excelDB.create({
            data: {
              iata: data[i]["IATA"], 
              tarifa: data[i]["TARIFA"],
              clasificacion: data[i]["CLASIFICACION"],
              destino: data[i]["DESTINO"].toString(), 
              equipaje_mano: data[i]["EQUIPAJE_MANO"],
              equipaje_bodega: data[i]["EQUIPAJE_BODEGA"],
              reembolso: data[i]["REEMBOLSABLE"],
              cambios: data[i]["CAMBIOS"]
            },
          });
      } 
    }catch(error){
      console.log(error)
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('Error');
      }
      throw error;
    }return {
      status : "Completado"
    }
  }

  @Get('datos')
  list(@Req() req: any) {
    return this.ExcelService.search(req);
  }

  @Get('todo')
      excel(@Req() req: any) {
    return this.ExcelService.ExcelData(req);
  }
}