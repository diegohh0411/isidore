import { Injectable } from '@nestjs/common';
import { BulkCreateEventsDto } from './dto/bulk-create-events.dto';
import { BulkUpdateEventsDto } from './dto/bulk-update-events.dto';
import { PaginationQueryDto } from 'src/common/dto/pagionation-query.dto';

import { Event } from './entities/event.entity';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { BadRequestException, NotFoundException } from '@nestjs/common';

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
        newEvent.startsAt = new Date(event.startsAt)
        newEvent.endsAt = new Date(event.endsAt)
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
        speakers: true
      }
    })
  }

  async findOne(uuid: string) {
    const event = await this.eventRepository.findOne({
      where: {
        UUID: uuid
      },
      relations: {
        expectedAttendees: true,
        speakers: true
      } 
    })
    if (!event) {
      throw new NotFoundException(`Event with UUID ${uuid} not found.`)
    }
    return event
  }

  async bulkUpdate(bulkUpdateEventsDto: BulkUpdateEventsDto) {
    const unupdateableEvents = []

    for (let i = 0; i < bulkUpdateEventsDto.events.length; i++) {
      const event = bulkUpdateEventsDto.events[i]

      const updatedEvent = await this.eventRepository.preload({
        UUID: event.UUID,
        ...event
      })

      if (!updatedEvent) {
        unupdateableEvents.push(event.UUID)
      } else {
        await this.eventRepository.save(updatedEvent)
      }
    }

    return `All events that could have been updated, were updated.` + (unupdateableEvents.length ? ` These events couldn't be updated, either because they didn't exist or for some other reason: ${unupdateableEvents.join(', ')}.` : '')
  }

  async remove(uuid: string) {
    const event = await this.findOne(uuid)
    return this.eventRepository.remove(event)
  }
}
