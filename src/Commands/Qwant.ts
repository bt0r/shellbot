import {AbstractCommand} from "./AbstractCommand";
import {Message}         from "discord.js";
import * as request      from "request";
import * as striptags    from "striptags";

/**
 * This command allow you to search something on the Qwant search engine !
 */
export class Qwant extends AbstractCommand {
    static NAME: string       = "qwant";
    private url: string       = "https://api.qwant.com/api/search/web?count=10&";
    private userAgent: string = "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:56.0) Gecko/20100101 Firefox/56.0";

    constructor() {
        super();
        this.name = "qwant";
    }

    do(message: Message) {
        let messageContent = message.content.split(" ");
        messageContent.shift(); // Remove command name !qwant
        let messageContentStr = messageContent.join(" ");
        if (messageContentStr !== undefined && messageContentStr !== "") {
            let command = this;
            command.info("Search query ${messageContent} from ${message.author.username}");
            let url     = this.url + "q=" + messageContentStr;
            let options = {
                url: url,
                method: "GET",
                headers: {"User-Agent": this.userAgent}
            };
            request(options, function (error, response, body) {
                let jsonResponse  = JSON.parse(body);
                let result        = jsonResponse.data.result.items;
                let resultContent = "";
                for (let i = 0; i < result.length; i++) {
                    let link    = result[i].url;
                    let title   = striptags(result[i].title);
                    let content = "**" + title + "**\n<" + link + ">";
                    resultContent += "\n" + content;
                }
                command.info("${result.length} results found.");
                message.reply(resultContent);
            });
        }
    }
}