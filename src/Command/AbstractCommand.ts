import {Message} from "discord.js";
import {Inject} from "typescript-ioc";
import {User} from "../Entity/User";
import {UserFactory} from "../Entity/UserFactory";
import {CommandCalledRepository} from "../Repository/CommandCalledRepository";
import {UserRepository} from "../Repository/UserRepository";
import {Database} from "../Service/Database";
import {Logger} from "../Service/Logger";

interface CommandInterface {
    name: string;
    do(message: Message): void;
}

export abstract class AbstractCommand implements CommandInterface {
    /**
     * Logger Log4Js
     * @type {Logger}
     * @private
     */
    @Inject
    private _logger: Logger;

    @Inject
    private _database: Database;

    /**
     * Config of current command
     */
    private _config: object;
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

    public abstract do(message: Message): void;

    public async worker(message: Message) {
        const commandCalledRepo = await this.database.manager.getCustomRepository(CommandCalledRepository);
        const userRepo = await this.database.manager.getCustomRepository(UserRepository);

        let user = UserFactory.create(message.author);
        if (user instanceof User) {
            user = await userRepo.findOrCreate(user);
            commandCalledRepo.add(user, this);
        }
        try {
            this.do(message);
        } catch (e) {
            this.error(e);
        }

        return this;
    }

    public get config(): any {
        return this._config;
    }

    public set config(config: any) {
        this._config = config;
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
        const logMessage = `[${this.name}] ${message}`;
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
}
