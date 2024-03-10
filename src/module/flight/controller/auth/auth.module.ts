import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthServices } from "./auth.services";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy";

@Module({

    imports : [PrismaModule, JwtModule.register({})],
    controllers : [AuthController], 
    providers : [AuthServices, JwtStrategy],
})

export class AuthModule{}