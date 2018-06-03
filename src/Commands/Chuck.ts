'use strict';
import {AbstractCommand} from "./AbstractCommand";
import * as request      from "request";
import {Message}         from "discord.js";
import {AllHtmlEntities}     from "html-entities";

export class Chuck extends AbstractCommand {
    static NAME: string = "chuck";
    /**
     * URL of Chuck noris API
     * @type {string}
     */
    private url: string = "https://chucknorrisfacts.fr/api/get?data=tri:alea;nb:1;type:txt";

    constructor() {
        super();
        this.name = Chuck.NAME;
    }

    do(message: Message) {
        var logger = this.logger;
        logger.info('Fetching new fact');
        request(this.url, function (error, response, body) {
            let jsonResponse = JSON.parse(body);
            let entities = new AllHtmlEntities();
            let fact = entities.decode(jsonResponse[0].fact);
            logger.info('New fact found ('+message.author.username+') : ' + fact);
            message.reply(fact);
        });
    }
}
