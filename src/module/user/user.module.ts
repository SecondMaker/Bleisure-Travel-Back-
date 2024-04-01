import { Module } from "@nestjs/common";
import { AuthController } from "./auth/auth.controller";
import { AuthServices } from "./auth/auth.services";
import { BookingController } from "./booking/booking.controller";
import { BookingService } from "./booking/booking.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./auth/strategy";
import { UserController } from "./user/user.controller";

@Module({

    imports : [PrismaModule, JwtModule.register({})],
    controllers : [AuthController, BookingController, UserController ], 
    providers : [AuthServices, JwtStrategy, BookingService ],
})

export class UserModule{}