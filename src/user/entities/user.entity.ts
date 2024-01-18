import { Column, Entity, PrimaryColumn } from "typeorm";
import { UserRole } from "../enums/user.enum";

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
}
