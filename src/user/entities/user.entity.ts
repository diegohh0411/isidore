import { Column, Entity, ManyToMany, PrimaryColumn, Index } from "typeorm";
import { UserRole } from "../enums/user.enum";

import { Event } from "src/event/entities/event.entity";

@Index(['email', 'first_name', 'last_name'])
@Entity()
export class User {
    @PrimaryColumn({ nullable: false })
    UUID: string

    @Column()
    email: string

    @Column()
    first_name: string

    @Column()
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

    @ManyToMany(
        type => Event,
        event => event.speakers
    )
    speakingAt: Event[]
}
