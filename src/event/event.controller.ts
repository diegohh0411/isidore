import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventService } from './event.service';

import { BulkCreateEventsDto } from './dto/bulk-create-events.dto';
import { BulkUpdateEventsDto } from './dto/bulk-update-events.dto';
import { PaginationQueryDto } from 'src/common/dto/pagionation-query.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // GET
  @Get()
  findAll(@Body() query: PaginationQueryDto) {
    return this.eventService.findAll(query);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.eventService.findOne(uuid)
  }

  // POST
  @Post()
  bulkCreate(@Body() bulkCreateEventsDto: BulkCreateEventsDto) {
    return this.eventService.bulkCreate(bulkCreateEventsDto);
  }

  // PATCH
  @Patch()
  bulkUpdate(@Body() bulkUpdateEventsDto: BulkUpdateEventsDto) {
    return this.eventService.bulkUpdate(bulkUpdateEventsDto);
  }

  // DELETE
  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.eventService.remove(uuid);
  }
}
