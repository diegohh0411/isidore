import { IsString } from "class-validator";

export class ExpectEventDto {
    @IsString()
    userUUID: string

    @IsString()
    eventUUID: string
}