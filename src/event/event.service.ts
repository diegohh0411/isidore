import { Injectable } from '@nestjs/common';
import { BulkCreateEventsDto } from './dto/bulk-create-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

import { Event } from './entities/event.entity';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { BadRequestException } from '@nestjs/common';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>
  ) {}

  async bulkCreate(bulkCreateEventsDto: BulkCreateEventsDto) {
    const alreadyExistingEvents = []

    for (let i = 0; i < bulkCreateEventsDto.events.length; i++) {
      const event = bulkCreateEventsDto.events[i]

      const existingEvent = await this.eventRepository.findOne({ where: { title: event.title }})

      if (existingEvent) {
        alreadyExistingEvents.push(event.title)
      } else {
        const newEvent = this.eventRepository.create(event)
        newEvent.UUID = crypto.randomUUID()
        await this.eventRepository.save(newEvent)
      }
    }

    return `All events that didn't exist have been created.` + (alreadyExistingEvents.length ? ` These events already existed: ${alreadyExistingEvents.join(', ')}.` : '')
  }

  findAll(query: PaginationQueryDto) {
    return this.eventRepository.find({
      skip: query.offset,
      take: query.limit,
      relations: {
        expectedAttendees: true,
        speakers: true
      }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
