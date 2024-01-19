import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";

import { CreateEventDto } from "./create-event.dto";

export class BulkCreateEventsDto {
    @IsNotEmpty()
    @Type(() => CreateEventDto)
    @ValidateNested()
    events: CreateEventDto[]
}