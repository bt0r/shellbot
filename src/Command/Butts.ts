import {Message} from "discord.js";
import {Container} from "typescript-ioc";
import {SexService} from "../Service/Command/SexService";
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
        const sexService = Container.get(SexService);
        try {
            sexService.randomButts((buttsRichEmbed) => {
                const messageResponse = message.channel.send(buttsRichEmbed);

                messageResponse.then(async (message2: Message) => {
                    await message2.react("👍");
                    await message2.react("👎");
                });
            });
        } catch (e) {
            this.error("Cannot fetch boobs picture, e:" + e.message);
        }
    }

    /**
     * Return URL of Boobs API
     * @returns {string}
     */
    public get url() {
        return this._url;
    }
}
