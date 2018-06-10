'use strict';
import {AbstractCommand} from "./AbstractCommand";
import * as request      from "request";
import {Message}         from "discord.js";
import {AllHtmlEntities} from "html-entities";

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

    do(message: Message) {
        var command = this;
        command.info('Fetching new fact');
        request(this.url, function (error, response, body) {
            let jsonResponse = JSON.parse(body);
            let entities     = new AllHtmlEntities();
            let fact         = entities.decode(jsonResponse[0].fact);
            command.info('New fact found (' + message.author.username + ') : ' + fact);
            message.reply(fact);
        });
    }
}
