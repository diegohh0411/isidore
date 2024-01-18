import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BulkCreateUsersDto } from './dto/bulk-create-users.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { BulkUpdateUsersRoleDto } from './dto/bulk-update-users-role.dto';
import { ExpectEventDto } from './dto/expect-event.dto';

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
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('bulk')
  bulkCreate(@Body() bulkCreateUsersDto: BulkCreateUsersDto) {
    return this.userService.bulkCreate(bulkCreateUsersDto)
  }

  @Post('expectEvent')
  expectEvent(@Body() expectEventDto: ExpectEventDto) {
    return this.userService.expectEvent(expectEventDto)
  }

  // PATCH
  // First goes the 'role' endpoint, to give it priority over any :uuid called 'role'.
  @Patch('role')
  updateRole(@Body() updateUserRoleDto: UpdateUserRoleDto) {
    return this.userService.updateUserRole(updateUserRoleDto)
  }

  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(uuid, updateUserDto);
  }

  @Patch('bulk/role')
  bulkUpdateRole(@Body() bulkUpdateUsersRoleDto: BulkUpdateUsersRoleDto) {
    return this.userService.bulkUpdateUsersRole(bulkUpdateUsersRoleDto)
  }

  // DELETE
  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.userService.remove(uuid);
  }
}
