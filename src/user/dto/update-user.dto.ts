import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsEnum } from 'class-validator';
import { UserRole } from '../enums/user.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    UUID: string

    @IsEnum(UserRole)
    role: UserRole
}
