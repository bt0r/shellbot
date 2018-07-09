"use strict";
import {Message} from "discord.js";
import {AllHtmlEntities} from "html-entities";
import * as request from "request";
import {AbstractCommand} from "./AbstractCommand";

export class Chuck extends AbstractCommand {
    public static NAME: string = "chuck";
    private _url: string       = "https://chucknorrisfacts.fr/api/get?data=tri:alea;nb:1;type:txt";

    constructor() {
        super();
        this.name = Chuck.NAME;
    }

    public get url() {
        return this._url;
    }

    public do(message: Message) {
        const command = this;
        command.info("Fetching new fact");
        request(this.url, (error, response, body) => {
            const jsonResponse = JSON.parse(body);
            const entities     = new AllHtmlEntities();
            const fact         = entities.decode(jsonResponse[0].fact);
            command.info(`New fact found (${message.author.username}) : ${fact}`);
            message.reply(fact);
        });
    }
}
