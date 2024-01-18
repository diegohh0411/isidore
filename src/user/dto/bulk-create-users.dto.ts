import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";

import { CreateUserDto } from "./create-user.dto";

export class BulkCreateUsersDto {
    @IsNotEmpty()
    @Type(() => CreateUserDto)
    @ValidateNested()
    users: CreateUserDto[]
}