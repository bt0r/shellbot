import {Logger} from "./Logger";

export class AbstractCommand{
    /**
     * Logger Log4js
     */
    private _logger: Logger = Logger.getInstance();

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
        this.logger.log(severity,`[${this.name}] ${message}`);
    }

    protected debug(message){
        this.log('debug',message);
    }

    protected info(message){
        this.log('info',message);
    }

    protected warning(message){
        this.log('warning',message);
    }

    protected error(message){
        this.log('error',message);
    }

    private get logger(){
        return this._logger;
    }
}