import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";

import { UpdateUserRoleDto } from "./update-user-role.dto";

export class BulkUpdateUsersRoleDto {
    @IsNotEmpty()
    @Type(() => UpdateUserRoleDto)
    @ValidateNested()
    users: UpdateUserRoleDto[]
}