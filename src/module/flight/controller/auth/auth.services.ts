import { Injectable } from "@nestjs/common";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { PrismaService } from "src/prisma/prisma.service";

@Injectable({})

export class AuthServices {
    constructor(private prisma: PrismaService) {}
    async signup(dto: AuthDto) {
        //generar hash para el password
        const hash = await argon.hash(dto.password);
        //guardar usuario
        const user = await this.prisma.user.create({
            data : {
                email: dto.email,
                hash,
            }
        })
        //devolver usuario
        return user;
        return {msg: 'i am signed up'};
    }

    signin() {

        return 'I am sign In';
    }
}