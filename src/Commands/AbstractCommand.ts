'use strict';
import {Logger} from "../Service/Logger";
import * as YAML from "yamljs";

interface CommandInterface{
    name: string;
    do();
}
export abstract class AbstractCommand implements CommandInterface{
    /**
     * Logger Log4Js
     * @type {Logger}
     * @private
     */
    private _logger: Logger = Logger.getInstance();

    /**
     * Config
     * @type {any}
     * @private
     */
    private _config = YAML.load('config/config.yml');
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

    private get logger(): Logger {
        return this._logger;
    }

    /**
     * Return the shellbot config
     * @returns {Object}
     */
    public get config(): Object {
        return this._config;
    }

    public abstract do();

    public worker(){
        this.do();

        return this;
    }
}
