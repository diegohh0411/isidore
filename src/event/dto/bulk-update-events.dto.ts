import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";

import { UpdateEventDto } from "./update-event.dto";

export class BulkUpdateEventsDto {
    @IsNotEmpty()
    @Type(() => UpdateEventDto)
    @ValidateNested()
    events: UpdateEventDto[]
}