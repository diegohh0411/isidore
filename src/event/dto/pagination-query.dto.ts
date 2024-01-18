import { IsNumber } from "class-validator";

export class PaginationQueryDto {
    @IsNumber()
    limit: number

    @IsNumber()
    offset: number
}