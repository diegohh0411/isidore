import { IsString, IsISO8601, IsOptional } from "class-validator";

export class CreateEventDto {
    @IsString()
    title: string

    @IsISO8601({ strict: true})
    startsAt: string

    @IsISO8601({ strict: true})
    endsAt: string

    @IsOptional()
    @IsString()
    description: string

    @IsOptional()
    @IsString()
    location: string
}
