import { UserRole } from "../enums/user.enum";
import { IsString } from "class-validator";

export class UpdateUserRoleDto {
    @IsString()
    uuid: string

    @IsString()
    role: UserRole
}