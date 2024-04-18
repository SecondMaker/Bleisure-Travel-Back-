import { Catch, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class NoFlightsAvailableException extends HttpException {
  constructor() {
    super('No flights available for this route', HttpStatus.NOT_FOUND);
  }
}
