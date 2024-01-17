import { IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    email: string

    @IsString()
    first_name: string

    @IsString()
    last_name: string
}
