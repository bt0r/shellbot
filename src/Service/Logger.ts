import {configure, getLogger, Logger as Logger4j} from "log4js";

export class Logger {
    /**
     * Log4Js Logger
     */
    private _logger: Logger4j;

    public constructor() {
        configure("./config/log4js.json");
        this.logger = getLogger("Shellbot");
        if (process.env.NODE_ENV === "production") {
            this.logger.level = "info";
        } else {
            this.logger.level = "debug";
        }
    }

    get logger(): Logger4j {
        return this._logger;
    }

    set logger(logger: Logger4j) {
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
