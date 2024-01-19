import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";

import { UpdateUserDto } from "./update-user.dto";

export class BulkUpdateUsersDto {
    @IsNotEmpty()
    @Type(() => UpdateUserDto)
    @ValidateNested()
    users: UpdateUserDto[]
}