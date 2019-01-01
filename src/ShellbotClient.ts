import {Client} from "discord.js";
import {Inject, Singleton} from "typescript-ioc";
import {Config} from "./Service/Config";
import {Logger} from "./Service/Logger";
import {Scheduler} from "./Service/Scheduler";
import {StatusService} from "./Service/StatusService";

@Singleton
export class ShellbotClient {
    @Inject
    private _config: Config;
    public discordClient: Client;
    private statusService: StatusService;
    private scheduler: Scheduler;

    @Inject
    private _logger: Logger;

    constructor() {
        this.discordClient = new Client();
        this.statusService = new StatusService(this);
    }

    public login() {
        this.logger.info("Shellbot is starting...");
        this.logger.info("Shellbot is instantiating...");
        this.discordClient.login(this.config.config.parameters.token).then(() => {
            this.logger.info("Shellbot logged !");
            this.statusService.logged();
            this.scheduler = new Scheduler(this.discordClient);
            this.logger.info("Shellbot started");
            this.statusService.ready();
        }).catch((reason) => {
            this.logger.error("Shellbot cannot login :'( , error:" + reason);
            this.statusService.error();
        });

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
