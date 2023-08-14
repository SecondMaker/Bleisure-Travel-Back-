import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class NoFlightsAvailableException extends HttpException {
    constructor() {
      console.log("on exception")
    super('No flights available for this route', HttpStatus.NOT_FOUND);
  }
}