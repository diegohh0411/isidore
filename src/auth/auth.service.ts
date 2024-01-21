import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(

    ) { }

    async signIn(uuid: string) {
        return 'hello ' + uuid
    }
}
