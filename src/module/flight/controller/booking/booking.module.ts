import { Module } from "@nestjs/common";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "../auth/strategy";

@Module({

    imports : [PrismaModule, JwtModule.register({})],
    controllers : [BookingController], 
    providers : [BookingService, JwtStrategy],
})

export class BookingModule{}