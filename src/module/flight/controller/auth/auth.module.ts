import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthServices } from "./auth.services";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports : [PrismaModule],
    controllers : [AuthController], 
    providers : [AuthServices],
})

export class AuthModule{}