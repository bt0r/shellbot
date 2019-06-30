import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn({
        name: "id",
    })
    private _id: number;
    @Column({
        name: "discord_id",
        unique: true,
    })
    private _discordId: string;
    @Column({
        name: "name",
    })
    private _name: string;
    @Column({
        name: "status",
    })
    private _status: string = "offline";

    @Column("datetime", {
        name: "last_connection",
    })
    private _lastConnection: Date = new Date();
    @Column("datetime", {
        name: "created_on",
        default: null,
        nullable: true,
    })
    private _createdOn: Date;

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get discordId(): string {
        return this._discordId;
    }

    set discordId(value: string) {
        this._discordId = value;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    get status(): string {
        return this._status;
    }

    set status(status: string) {
        this._status = status;
    }

    get lastConnection(): Date {
        return this._lastConnection;
    }

    set lastConnection(value: Date) {
        this._lastConnection = value;
    }

    get createdOn(): Date {
        return this._createdOn;
    }

    set createdOn(value: Date) {
        this._createdOn = value;
    }
}
