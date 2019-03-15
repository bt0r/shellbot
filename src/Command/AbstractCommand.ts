"use strict";
import {Message} from "discord.js";
import {Inject} from "typescript-ioc";
import {UserFactory} from "../Entity/UserFactory";
import {CommandCalledRepository} from "../Repository/CommandCalledRepository";
import {UserRepository} from "../Repository/UserRepository";
import {Database} from "../Service/Database";
import {Logger} from "../Service/Logger";

interface ICommand {
    name: string;
    do(message: Message);
}

export abstract class AbstractCommand implements ICommand {
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

    public abstract do(message: Message);

    public async worker(message: Message) {
        const commandCalledRepo = await this.database.manager.getCustomRepository(CommandCalledRepository);
        const userRepo = await this.database.manager.getCustomRepository(UserRepository);

        let user = UserFactory.create(message.author);
        user = await userRepo.findOrCreate(user);
        commandCalledRepo.add(user, this);
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

    protected debug(message) {
        this.log("debug", message);
    }

    protected info(message) {
        this.log("info", message);
    }

    protected warning(message) {
        this.log("warning", message);
    }

    protected error(message) {
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
        this.logger[severity](`[${this.name}] ${message}`);
    }
}
