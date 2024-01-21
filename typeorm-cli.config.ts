import { Event } from "src/event/entities/event.entity";
import { User } from "src/user/entities/user.entity";
import { DataSource } from "typeorm";

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'pass123',
    database: 'postgres',
    entities: [User, Event],
    migrations: [],
  });