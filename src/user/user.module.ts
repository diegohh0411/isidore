import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Event } from 'src/event/entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Event])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
