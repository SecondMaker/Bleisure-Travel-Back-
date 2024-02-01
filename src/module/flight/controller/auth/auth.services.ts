import { Injectable } from "@nestjs/common";

@Injectable({})

export class AuthServices {
    signin() {
        return 'I am sign In';
    }

    signup() {
        return {msg: 'i am signed up'};
    }
}