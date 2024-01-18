import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";
import { UserRole } from "../enums/user.enum";

import { Event } from "src/event/entities/event.entity";

@Entity()
export class User {
    @PrimaryColumn({ nullable: false })
    UUID: string

    @Column()
    email: string

    @Column()
    first_name: string

    @Column('json', { nullable: true })
    last_name: string

    @Column({
        type: 'enum',
        enum: UserRole
    })
    role: UserRole

    @ManyToMany(
        type => Event,
        event => event.expectedAttendees
    )
    expectedEvents: Event[]
}
