import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';

import { BulkCreateUsersDto } from './dto/bulk-create-users.dto';
import { BulkUpdateUsersDto } from './dto/bulk-update-users.dto';
import { PaginationQueryDto } from 'src/common/dto/pagionation-query.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET
  @Get()
  findAll(@Body() query: PaginationQueryDto) {
    return this.userService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.userService.findOne(uuid);
  }

  // POST
  @Post()
  bulkCreate(@Body() bulkCreateUsersDto: BulkCreateUsersDto) {
    return this.userService.bulkCreate(bulkCreateUsersDto)
  }

  @Post(':userUUID/expectEvent/:eventUUID')
  expectEvent(@Param('userUUID') userUUID, @Param('eventUUID') eventUUID) {
    return this.userService.expectEvent(userUUID, eventUUID)
  }

  @Post(':userUUID/speakingAt/:eventUUID')
  speakingAt(@Param('userUUID') userUUID, @Param('eventUUID') eventUUID) {
    return this.userService.speakingAt(userUUID, eventUUID)
  }

  // PATCH
  @Patch()
  bulkUpdate(@Body() bulkUpdateUsersDto: BulkUpdateUsersDto) {
    return this.userService.bulkUpdate(bulkUpdateUsersDto)
  }

  // DELETE
  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.userService.remove(uuid);
  }
}
