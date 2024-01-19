import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { BulkCreateUsersDto } from './dto/bulk-create-users.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { BulkUpdateUsersDto } from './dto/bulk-update-users.dto';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Event } from 'src/event/entities/event.entity';
import { UserRole } from './enums/user.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>
  ) {}

  async bulkCreate(bulkCreateUsersDto: BulkCreateUsersDto) {
    const alreadyExistingAccounts = []

    for (let i = 0; i < bulkCreateUsersDto.users.length; i++) {
      const user = bulkCreateUsersDto.users[i]

      const existingUser = await this.userRepository.findOne({ where: { email: user.email }})

      if (existingUser) {
        alreadyExistingAccounts.push(user.email)
      } else {
        const newUser = this.userRepository.create(user)
        newUser.UUID = crypto.randomUUID()
        newUser.role = UserRole.attendee
        await this.userRepository.save(newUser)
      }
    }

    return `All accounts that didn't exist have been created.` + (alreadyExistingAccounts.length ? ` These accounts already existed: ${alreadyExistingAccounts.join(', ')}.` : '')
  }

  findAll(query: PaginationQueryDto) {
    return this.userRepository.find({
      skip: query.offset,
      take: query.limit
    })
  }

  async findOne(uuid: string) {
    const user = await this.userRepository.findOne({
      where: {
        UUID: uuid
      },
      relations: {
        expectedEvents: true,
        speakingAt: true
      } 
    })
    if (!user) {
      throw new NotFoundException(`User with UUID ${uuid} not found.`)
    }
    return user
  }

  async bulkUpdate(bulkUpdateUsersDto: BulkUpdateUsersDto) {
    const unupdateableAccounts = []

    for (let i = 0; i < bulkUpdateUsersDto.users.length; i++) {
      const user = bulkUpdateUsersDto.users[i]

      const updatedUser = await this.userRepository.preload({
        UUID: user.UUID,
        ...user
      })

      if (!updatedUser) {
        unupdateableAccounts.push(user.UUID)
      } else {
        await this.userRepository.save(updatedUser)
      }
    }

    return `All accounts that could have been updated, were updated.` + (unupdateableAccounts.length ? ` These accounts couldn't be updated, either because they didn't exist or for some other reason: ${unupdateableAccounts.join(', ')}.` : '')
  }

  async remove(uuid: string) {
    const user = await this.findOne(uuid)
    return this.userRepository.remove(user)
  }

  async expectEvent(userUUID, eventUUID) {
    const user = await this.userRepository.findOne({
      where: {
        UUID: userUUID
      },
      relations: {
        expectedEvents: true
      }
    })
    if (!user) {
      throw new NotFoundException(`User with UUID ${userUUID} not found.`)
    }

    const event = await this.eventRepository.findOne({
      where: {
        UUID: eventUUID
      },
      relations: {
        expectedAttendees: true
      }
    })
    if (!event) {
      throw new NotFoundException(`Event with UUID ${eventUUID} not found.`)
    }

    user.expectedEvents.push(event)
    await this.userRepository.save(user)
    event.expectedAttendees.push(user)
    await this.eventRepository.save(event)
  }

  async speakingAt(userUUID, eventUUID) {
    const user = await this.userRepository.findOne({
      where: {
        UUID: userUUID
      },
      relations: {
        speakingAt: true
      }
    })
    if (!user) {
      throw new NotFoundException(`User with UUID ${userUUID} not found.`)
    } else if (user.role !== UserRole.speaker) {
      throw new BadRequestException(`User with UUID ${userUUID} must have a role of ${UserRole.speaker}`)
    }

    const event = await this.eventRepository.findOne({
      where: {
        UUID: eventUUID
      },
      relations: {
        speakers: true
      }
    })
    if (!event) {
      throw new NotFoundException(`Event with UUID ${eventUUID} not found.`)
    }

    user.speakingAt.push(event)
    await this.userRepository.save(user)
    event.speakers.push(user)
    await this.eventRepository.save(event)
  }
}
