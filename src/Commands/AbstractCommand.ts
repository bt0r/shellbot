'use strict';
import {Logger}  from "../Service/Logger";
import {Message} from "discord.js";

interface CommandInterface {
    name: string;

    do(message: Message);
}

export abstract class AbstractCommand implements CommandInterface {
    /**
     * Logger Log4Js
     * @type {Logger}
     * @private
     */
    private _logger: Logger = Logger.getInstance();

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

    /**
     * Log with Log4js
     * @param severity
     * @param message
     */
    private log(severity: string, message: string) {
        this.logger[severity](`[${this.name}] ${message}`);
    }

    protected debug(message) {
        this.log('debug', message);
    }

    protected info(message) {
        this.log('info', message);
    }

    protected warning(message) {
        this.log('warning', message);
    }

    protected error(message) {
        this.log('error', message);
    }

    protected get logger(): Logger {
        return this._logger;
    }

    public abstract do(message: Message);

    public worker(message: Message) {
        this.do(message);

        return this;
    }

    public get config(): any{
        return this._config;
    }

    public set config(config: any) {
        this._config = config;
    }
}
