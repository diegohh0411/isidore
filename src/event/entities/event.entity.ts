import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";
import { User } from "src/user/entities/user.entity";

@Entity()
export class Event {
    @PrimaryColumn({ nullable: false })
    UUID: string
    
    @Column({ nullable: false })
    title: string

    @JoinTable()
    @ManyToMany(
        type => User, 
        user => user.expectedEvents 
    )
    expectedAttendees: User[]

    @JoinTable()
    @ManyToMany(
        type => User,
        user => user.speakingAt
    )
    speakers: User[]

    @Column({ nullable: true })
    description: string

    @Column({ type: 'timestamp with time zone'})
    startsAt: Date

    @Column({ type: 'timestamp with time zone'})
    endsAt: Date

    @Column({ nullable: true })
    location: string
}
