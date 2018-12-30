import {Client, TextChannel} from "discord.js";
import {Inject} from "typescript-ioc";
import {Database} from "../Service/Database";
import {Logger} from "../Service/Logger";

interface ISchedule {
    name: string;
    do(channel?: TextChannel): void;
}

export abstract class AbstractSchedule implements ISchedule {
    /**
     * Logger Log4Js
     * @type {Logger}
     * @private
     */
    @Inject
    private _logger: Logger;

    @Inject
    private _database: Database;

    private _discordClient: Client;

    /**
     * Name of the command
     * @type string
     * @private
     */
    private _name: string;

    public get name() {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    protected debug(message: string) {
        this.log("debug", message);
    }

    protected info(message: string) {
        this.log("info", message);
    }

    protected warning(message: string) {
        this.log("warning", message);
    }

    protected error(message: string) {
        this.log("error", message);
    }

    protected get logger(): Logger {
        return this._logger;
    }

    protected get database(): Database {
        return this._database;
    }

    /**
     * Log with Log4js
     * @param severity
     * @param message
     */
    private log(severity: string, message: string) {
        const logMessage = `[SCH:${this.name}] ${message}`;
        switch (severity) {
            case "debug":
                this.logger.debug(logMessage);
                break;
            case "info":
                this.logger.info(logMessage);
                break;
            case "warning":
                this.logger.warning(logMessage);
                break;
            case "error":
                this.logger.error(logMessage);
                break;
        }
    }

    public set discordClient(discordClient: Client) {
        this._discordClient = discordClient;
    }

    public get discordClient() {
        return this._discordClient;
    }

    public abstract do(channel?: TextChannel): void;
}
