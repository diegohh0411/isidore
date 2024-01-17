import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

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
    return this.userRepository.save(user)
  }

  findAll() {
    return this.userRepository.find()
  }

  async findOne(email: string) {
    const user = await this.userRepository.findOne({ where: {email: email} })
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found.`)
    }
    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id: +id,
      ...updateUserDto
    })
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`)
    }
    return this.userRepository.save(user)
  }

  async remove(email: string) {
    const user = await this.findOne(email)
    return this.userRepository.remove(user)
  }
}
