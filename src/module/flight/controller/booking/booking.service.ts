import { ForbiddenException, Injectable, Req } from "@nestjs/common";
import * as argon from 'argon2'
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { isEmpty } from "class-validator";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { User } from "@prisma/client";
import { type } from "os";
import { BookingDto } from './dto/booking.dto';

@Injectable({})
export class BookingService {

    constructor(private prisma: PrismaService, private jwt:JwtService, private config:ConfigService) {}
    
    async save(dto: BookingDto, req) {

        //guardar reserva
        try {
            const user = await this.prisma.bookings.create({
                data : {
                    codigo_reserva: dto.codigo_reserva,
                    status: dto.status,
                    email: req.user.email,
                }
            });

            //devolver respuesta
            return {
                status: "Guardado"
            };
        }catch(error){
            if(error instanceof PrismaClientKnownRequestError){

                throw new ForbiddenException('Error',);
           
            }
            throw error;
        }
        
    }

    async listall(req) {

        try {
            
            const bookings = await this.prisma.bookings.findMany({
           /*     where : {
                    email : {
                        equals: req.user.email,
                    }
                }  */
            });

            return bookings;
        }catch(error){
            if(error instanceof PrismaClientKnownRequestError){

                throw new ForbiddenException('Error',);
           
            }
            throw error;
        }
        
    }

}