"use strict";
import {Client, TextChannel} from "discord.js";
import {Inject} from "typescript-ioc";
import {Database} from "../Service/Database";
import {Logger} from "../Service/Logger";

interface ISchedule {
    name: string;
    do(channel?: TextChannel);
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
        this.logger[severity](`[SCH:${this.name}] ${message}`);
    }

    public set discordClient(discordClient: Client) {
        this._discordClient = discordClient;
    }

    public get discordClient() {
        return this._discordClient;
    }

    public abstract do(channel?: TextChannel);
}
