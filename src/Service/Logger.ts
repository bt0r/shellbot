import {configure, getLogger} from "log4js";

export class Logger {
    /**
     * Log4Js Logger
     */
    private _logger;

    public constructor() {
        configure("./config/log4js.json");
        this.logger = getLogger("Shellbot");
        if (process.env.NODE_ENV === "production") {
            this.logger.level = "info";
        } else {
            this.logger.level = "debug";
        }
    }

    get logger() {
        return this._logger;
    }

    set logger(logger: any) {
        this._logger = logger;
    }

    public debug(message: string) {
        return this.logger.debug(message);
    }

    public info(message: string) {
        return this.logger.info(message);
    }

    public warning(message: string) {
        return this.logger.warn(message);
    }

    public error(message: string) {
        return this.logger.error(message);
    }
}
