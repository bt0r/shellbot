import {Message} from "discord.js";
import {Container} from "typescript-ioc";
import {SexService} from "../Service/Command/SexService";
import {AbstractCommand} from "./AbstractCommand";

/**
 * 🔞 This command will show some randoms boobies 🔞
 */
export class Boobs extends AbstractCommand {
    public static NAME: string = "boobs";

    constructor() {
        super();
        this.name = "boobs";
    }

    public do(message: Message) {
        const command = this;
        command.info("Fetching new booby picture");
        const sexService = Container.get(SexService);
        try {
            sexService.randomBoobs((boobsRichEmbed: any) => {
                const messageResponse = message.channel.send(boobsRichEmbed);

                messageResponse.then(async (message2) => {
                    if (message2 instanceof Message) {
                        await message2.react("👍");
                        await message2.react("👎");
                    }
                });
            });
        } catch (e) {
            this.error("Cannot fetch boobs picture, e:" + e.message);
        }
    }
}
