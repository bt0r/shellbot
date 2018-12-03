import {TextChannel} from "discord.js";
import {AbstractSchedule} from "./AbstractSchedule";

export class Message extends AbstractSchedule {
    public static NAME: string = "message";
    private readonly _message: string;

    public constructor(args) {
        super();
        this.name = Message.NAME;
        if (args.length > 0) {
            this._message = args[0];
        }
    }

    public do(channel: TextChannel) {
        channel.send(this._message).then(() => {
            this.info("Message sent: " + this._message);
        }).catch(() => {
            this.error("Error when sending message: " + this._message);
        });
    }
}
