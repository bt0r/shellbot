import {Client} from "discord.js";
import {Inject} from "typescript-ioc";
import {Listener} from "./Listener/Listener";
import {Config} from "./Service/Config";
import {Logger} from "./Service/Logger";
import {Scheduler} from "./Service/Scheduler";

export class ShellbotClient {
    /**
     * Config file
     * @type {any}
     * @private
     */
    @Inject
    private _config: Config;

    /**
     * Discord.JS bot client
     * @type {"discord.js".Client}
     * @private
     */
    private _discordClient: Client = new Client();

    private _listener: Listener;

    /**
     * Logger
     * @type {Logger}
     * @private
     */
    @Inject
    private _logger: Logger;

    constructor() {
        this.logger.info("Shellbot is starting...");
        this.logger.info("Shellbot is instantiating...");
        this.discordClient.login(this.config.config.parameters.token).then(() => {
            this.logger.info("Shellbot logged !");
            this._listener = new Listener(this);
            const s = new Scheduler(this.discordClient);
            this.logger.info("Shellbot started");
        }).catch(() => {
            this.logger.error("Shellbot cannot login :'( ");
        });
    }

    /**
     * Return a discordJS client
     * @returns {"discord.js".Client}
     */
    public get discordClient() {
        return this._discordClient;
    }

    /**
     * Return the shellbot config
     * @returns Config
     */
    public get config() {
        return this._config;
    }

    private get logger() {
        return this._logger;
    }

    private set logger(logger: Logger) {
        this._logger = logger;
    }
}
