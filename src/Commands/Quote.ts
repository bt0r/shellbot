import {Message, RichEmbed} from "discord.js";
import {AbstractCommand} from "./AbstractCommand";

export class Quote extends AbstractCommand {
    public static NAME: string = "quote";

    constructor() {
        super();
        this.name = "quote";
    }

    public do(message: Message) {
        const config = this.config;
        const logger = this.logger;
        const messageStr: string = message.content;
        const regexpQuote = new RegExp("^.+\\s(\\d+)\\s(.+)", "i");
        const matches = messageStr.match(regexpQuote);
        if (matches) {
            const messageId: string = matches[1];
            const messageContent: string = matches[2];
            message.channel.fetchMessage(messageId).then((messageFound) => {
                const authorMessage = `<@${messageFound.author.id}>, <@${message.author.id}> ${config.replied_label} :\n${messageContent}`;
                const quotedEmbed = new RichEmbed();
                quotedEmbed.setAuthor(messageFound.author.username, messageFound.author.avatarURL);
                quotedEmbed.setDescription(messageFound.content);
                quotedEmbed.setThumbnail(messageFound.author.avatarURL);
                quotedEmbed.setColor("#4286f4");
                messageFound.channel.send(authorMessage, quotedEmbed);
                message.delete();
            }).catch((error) => {
                logger.error(error);
            });
        }
    }
}
