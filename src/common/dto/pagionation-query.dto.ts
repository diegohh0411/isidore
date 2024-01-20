import { IsOptional, IsPositive } from "class-validator";
import { Type } from "class-transformer";

export class PaginationQueryDto {
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    limit: number

    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    offset: number
}