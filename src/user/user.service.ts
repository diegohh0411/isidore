import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BulkCreateUsersDto } from './dto/bulk-create-users.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { BulkUpdateUsersRoleDto } from './dto/bulk-update-users-role.dto';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './enums/user.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({ where: {email: createUserDto.email} })
    if (existingUser) {
      throw new BadRequestException(`User with email ${createUserDto.email} already exists.`)
    }

    const user = this.userRepository.create(createUserDto)
    user.UUID = crypto.randomUUID()
    user.role = UserRole.attendee
    return this.userRepository.save(user)
  }

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
    const user = await this.userRepository.findOne({ where: {UUID: uuid} })
    if (!user) {
      throw new NotFoundException(`User with UUID ${uuid} not found.`)
    }
    return user
  }

  async update(uuid: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      UUID: uuid,
      ...updateUserDto
    })
    if (!user) {
      throw new NotFoundException(`User with UUID ${uuid} not found.`)
    }
    return await this.userRepository.save(user)
  }

  async updateUserRole(updateUserRoleDto: UpdateUserRoleDto) {
    if (!Object.values(UserRole).includes(updateUserRoleDto.role)) {
      throw new BadRequestException(`Role property should correspond to one of these: ${Object.values(UserRole).join(', ')}.`)
    }
    const user = await this.userRepository.preload({
      UUID: updateUserRoleDto.uuid,
      role: updateUserRoleDto.role
    })
    if (!user) {
      throw new NotFoundException(`User with UUID ${updateUserRoleDto.uuid} not found.`)
    }
    return await this.userRepository.save(user)
  }

  async bulkUpdateUsersRole(bulkUpdateUsersRoleDto: BulkUpdateUsersRoleDto) {
    const accountsThatDidntExistOrCouldntBeUpdated = []

    for (let i = 0; i < bulkUpdateUsersRoleDto.users.length; i++) {
      const user = bulkUpdateUsersRoleDto.users[i]
      
      try {
        const updatedUser = await this.userRepository.preload({
          UUID: user.uuid,
          role: user.role
        })
        await this.userRepository.save(updatedUser)
      } catch(e) {
        accountsThatDidntExistOrCouldntBeUpdated.push(user.uuid)
      }
    }

    return `All accounts that could be updated, were updated.` + (accountsThatDidntExistOrCouldntBeUpdated.length ? ` These accounts didn't exist or couldn't be updated: ${accountsThatDidntExistOrCouldntBeUpdated.join(', ')}.` : '')
  }

  async remove(uuid: string) {
    const user = await this.findOne(uuid)
    return this.userRepository.remove(user)
  }
}
