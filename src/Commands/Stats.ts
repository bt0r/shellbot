"use strict";
import {Message, RichEmbed} from "discord.js";
import {CommandCalledRepository} from "../Repository/CommandCalledRepository";
import {AbstractCommand} from "./AbstractCommand";

export class Stats extends AbstractCommand {
    public static NAME: string = "stats";

    constructor() {
        super();
        this.name = "stats";
    }

    public async do(message: Message) {
        const commandCalledRepo = await this.database.manager.getCustomRepository(CommandCalledRepository);
        commandCalledRepo.stats().then(async (stats) => {
            let i = 1;

            const richEmbed = new RichEmbed();
            richEmbed.setTitle(this.config.lang.title);
            richEmbed.setDescription(this.config.lang.description);
            richEmbed.setColor("#2286f4");

            for (const stat of stats) {
                let name = `${stat.command_name} (${stat.count} hit)`;
                switch (i) {
                    case 1:
                        name = "🥇 " + name;
                        break;
                    case 2:
                        name = "🥈 " + name;
                        break;
                    case 3:
                        name = "🥉 " + name;
                        break;
                    default:
                        name = i + " - " + name;
                        break;
                }
                i++;
                const top = await commandCalledRepo.topByCommand(stat.command_name);
                const nameList = [];
                for (const user of top) {
                    nameList.push(`${user.name} (${user.hit} hit)`);
                }
                richEmbed.addField(name, nameList.join(", "));
            }

            message.channel.send(richEmbed);
        }).catch((reason) => {
            this.logger.error(this.config.lang.error + " e:" + reason);
        });

    }
}
