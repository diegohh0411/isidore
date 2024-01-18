import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
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

  async create(createEventDto: CreateEventDto) {
    const existingEvent = await this.eventRepository.findOne({ where: {title: createEventDto.title} })
    if (existingEvent) {
      throw new BadRequestException(`Event with title ${createEventDto.title} already exists.`)
    }

    const event = this.eventRepository.create(createEventDto)
    event.UUID = crypto.randomUUID()
    return this.eventRepository.save(event)
  }

  findAll(query: PaginationQueryDto) {
    return this.eventRepository.find({
      skip: query.offset,
      take: query.limit,
      relations: {
        expectedAttendees: true
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
