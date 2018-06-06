import {AbstractCommand} from "./AbstractCommand";
import {Message}         from "discord.js";
import * as request      from "request";

export class Cat extends AbstractCommand {
    public static NAME: string = "cat";
    private _url: string       = "http://aws.random.cat/meow";

    constructor() {
        super();
        this.name = Cat.NAME;
    }

    public get url(): string {
        return this._url;
    }

    do(message: Message) {
        var command = this;
        command.info('Fetching new cat picture');
        let authorId = message.author.id;
        let title    = `<@${authorId}>`;

        request(command.url, function (error, response, body) {
            let jsonResponse = JSON.parse(body);
            if (jsonResponse.file) {
                let url = jsonResponse.file;
                command.info('New cat found (' + url + ')');
                message.channel.send(title, {
                    file: url
                });
            }
        });
    }
}