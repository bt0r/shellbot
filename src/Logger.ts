import {configure, getLogger} from 'log4js';

export class Logger {

    /**
     * Log4Js Logger
     */
    private _logger;

    constructor() {
        configure('./config/log4js.json')
        this.logger = getLogger("Shellbot")

        if (process.env === "production") {
            this.logger.level = 'info';
        } else {
            this.logger.level = 'debug';
        }
    }

    get logger() {
        return this._logger;
    }

    set logger(logger) {
        this._logger = logger;
    }

    debug(message) {
        return this.logger.debug(message)
    }

    info(message) {
        return this.logger.info(message)
    }

    warning(message) {
        return this.logger.warning(message)
    }

    error(message) {
        return this.logger.error(message)
    }


}