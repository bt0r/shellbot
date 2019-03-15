"use strict";
import axios from "axios";
import {Message} from "discord.js";
import * as striptags from "striptags";
import {AbstractCommand} from "./AbstractCommand";

/**
 * This command allow you to search something on the Qwant search engine !
 */
export class Qwant extends AbstractCommand {
    public static NAME: string = "qwant";
    private url: string = "https://api.qwant.com/api/search/web?count=10&t=web&uiv=4&";
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
            };
            axios.get(url, options).then((response) => {
                const results = response.data.data.result.items;
                let resultContent = "";
                for (const result of results) {
                    const link = result.url;
                    const title = striptags(result.title);
                    const content = "**" + title + "**\n<" + link + ">";
                    resultContent += "\n" + content;
                }
                command.info(`${results.length} results found.`);
                message.reply(resultContent);
            }).catch((reason) => {
                this.error(reason);
            });
        }
    }
}
