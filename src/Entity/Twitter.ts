import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Twitter {
    @PrimaryGeneratedColumn({
        name: "id",
    })
    protected _id: number;
    @Column({
        name: "twitter_id",
        unique: true,
    })
    protected _twitterId: string;
    @Column("datetime", {
        name: "date",
    })
    protected _date: Date = new Date();
    @Column({
        name: "channel",
        length: 100,
    })
    private _channel: string;
    @Column({
        name: "username",
        length: 50,
    })
    private _username: string;

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get twitterId(): string {
        return this._twitterId;
    }

    set twitterId(value: string) {
        this._twitterId = value;
    }

    get date(): Date {
        return this._date;
    }

    set date(value: Date) {
        this._date = value;
    }

    get channel(): string {
        return this._channel;
    }

    set channel(value: string) {
        this._channel = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }
}
