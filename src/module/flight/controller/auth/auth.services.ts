import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable({})

export class AuthServices {
    constructor(private prisma: PrismaService) {}
    async signup(dto: AuthDto) {
        //generar hash para el password
        const hash = await argon.hash(dto.password);
        //guardar usuario
        try {
            const user = await this.prisma.user.create({
                data : {
                    email: dto.email,
                    hash,
                }
            })
            delete user.hash;
            //devolver usuario
            return user;
        }catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == 'P2002'){
                throw new ForbiddenException('Usuario duplicado',);
                }
            }
            throw error;
        }
        
    }

    signin() {
        //Buscar el usuario
        //Si el usuario no existe
        return 'I am sign In';
    }
}