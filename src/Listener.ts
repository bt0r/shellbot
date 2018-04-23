import {Client, Message} from "discord.js";
import {Logger} from "./Logger";

export class Listener {
    /**
     * Log4js Logger
     */
    private _logger: Logger;

    constructor(discordClient: Client) {
        this.logger = new Logger();

        discordClient.on('ready', () => this.ready());
        discordClient.on('message', message => this.message(message));
    }

    ready() {
        this.logger.info("Ready !")
    }

    message(message: Message) {
        this.logger.debug("Message received" + message.content);
    }

    get logger(){
        return this._logger;
    }

    set logger(logger){
        this._logger = logger;
    }
}