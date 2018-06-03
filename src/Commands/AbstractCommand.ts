'use strict';
import {Logger} from "../Service/Logger";

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


    public abstract do();

    public worker(){
        this.do();

        return this;
    }
}
