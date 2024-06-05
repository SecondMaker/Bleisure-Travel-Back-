import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';

@Controller('upload')
export class UploadController {

  @Post('excel')
  @UseInterceptors(FileInterceptor('file'))
   async uploadFile(@UploadedFile() file) {
   console.log(file)
   
   /* const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);  */
  }
}