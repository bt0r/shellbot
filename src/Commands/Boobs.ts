"use strict";
import {AbstractCommand} from "./AbstractCommand";
import {Message}         from "discord.js";
import * as request      from "request";

/**
 * 🔞 This command will show some randoms boobies 🔞
 */
export class Boobs extends AbstractCommand {
    public static NAME: string = "boobs";
    private _url: string       = "http://api.oboobs.ru/boobs/1/1/random";

    constructor() {
        super();
        this.name = "boobs";
    }

    do(message: Message) {
        var command = this;
        command.info('Fetching new booby picture');
        request(this.url, function (error, response, body) {
            let jsonResponse = JSON.parse(body);
            let boobsPicture = "http://media.oboobs.ru/" + jsonResponse[0].preview.replace("boobs_preview", "boobs");
            let authorId     = message.author.id;
            let model        = jsonResponse[0].model !== null ? " - " + jsonResponse[0].model : "";
            let title        = `<@${authorId}> ${model}`;

            command.info('New boobs found (' + message.author.username + ') : ' + boobsPicture);
            let messageResponse = message.channel.send(title, {
                file: boobsPicture
            });
            messageResponse.then(async function (message: Message) {
                await message.react("👍");
                await message.react("👎");
            });
        });
    }

    /**
     * Return URL of Boobs API
     * @returns {string}
     */
    public get url() {
        return this._url
    }
}