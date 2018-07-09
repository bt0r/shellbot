"use strict";
import {Message} from "discord.js";
import * as request from "request";
import {AbstractCommand} from "./AbstractCommand";

/**
 * 🔞 This command will show some randoms boobies 🔞
 */
export class Butts extends AbstractCommand {
    public static NAME: string = "butts";
    private _url: string = "http://api.obutts.ru/butts/1/1/random";

    constructor() {
        super();
        this.name = "butts";
    }

    public do(message: Message) {
        const command = this;
        command.info("Fetching new booby picture");
        request(this.url, (error, response, body) => {
            const jsonResponse = JSON.parse(body);
            const boobsPicture = "http://media.obutts.ru/" + jsonResponse[0].preview.replace("butts_preview", "butts");
            const authorId = message.author.id;
            const model = jsonResponse[0].model !== null ? " - " + jsonResponse[0].model : "";
            const title = `<@${authorId}> ${model}`;

            command.info("New boobs found (" + message.author.username + ") : " + boobsPicture);
            const messageResponse = message.channel.send(title, {
                file: boobsPicture,
            });
            messageResponse.then(async (message2: Message) => {
                await message2.react("👍");
                await message2.react("👎");
            });
        });
    }

    /**
     * Return URL of Boobs API
     * @returns {string}
     */
    public get url() {
        return this._url;
    }
}
