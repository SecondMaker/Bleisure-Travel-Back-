import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthServices } from "./auth.services";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";

@Module({

    imports : [PrismaModule, JwtModule.register({})],
    controllers : [AuthController], 
    providers : [AuthServices],
})

export class AuthModule{}