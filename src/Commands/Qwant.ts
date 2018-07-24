"use strict";
import {Message} from "discord.js";
import * as request from "request";
import * as striptags from "striptags";
import {AbstractCommand} from "./AbstractCommand";

/**
 * This command allow you to search something on the Qwant search engine !
 */
export class Qwant extends AbstractCommand {
    public static NAME: string = "qwant";
    private url: string = "https://api.qwant.com/api/search/web?count=10&";
    private userAgent: string = "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:56.0) Gecko/20100101 Firefox/56.0";

    constructor() {
        super();
        this.name = "qwant";
    }

    public do(message: Message) {
        const messageContent = message.content.split(" ");
        messageContent.shift(); // Remove command name !qwant
        const messageContentStr = messageContent.join(" ");
        if (messageContentStr !== undefined && messageContentStr !== "") {
            const command = this;
            command.info(`Search query ${messageContent} from ${message.author.username}`);
            const url = this.url + "q=" + messageContentStr;
            const options = {
                headers: {"User-Agent": this.userAgent},
                method: "GET",
                url,
            };
            request(options, (error, response, body) => {
                const jsonResponse = JSON.parse(body);
                const results = jsonResponse.data.result.items;
                let resultContent = "";
                for (const resultId in results) {
                    const result = results[resultId];
                    const link = result.url;
                    const title = striptags(result.title);
                    const content = "**" + title + "**\n<" + link + ">";
                    resultContent += "\n" + content;
                }
                command.info(`${results.length} results found.`);
                message.reply(resultContent);
            });
        }
    }
}
