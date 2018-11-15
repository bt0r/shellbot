import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

@Entity()
@Index(["_commandName", "_user"], { unique: true })
export class CommandCalled {
    @PrimaryGeneratedColumn({
        name: "id",
    })
    private _id: number;

    @ManyToOne((type) => User, (user) => user.id)
    @JoinColumn({
        name: "user_id",
    })
    private _user: User;

    @Column({
        name: "count",
    })
    private _count: number = 0;

    @Column({
        name: "command_name",
    })
    private _commandName: string;

    @Column("datetime", {
        name: "latest_use",
    })
    private _latestUse: Date = new Date();

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get user(): User {
        return this._user;
    }

    set user(value: User) {
        this._user = value;
    }

    get count(): number {
        return this._count;
    }

    set count(value: number) {
        this._count = value;
    }

    get commandName(): string {
        return this._commandName;
    }

    set commandName(value: string) {
        this._commandName = value;
    }

    get latestUse(): Date {
        return this._latestUse;
    }

    set latestUse(value: Date) {
        this._latestUse = value;
    }
}
