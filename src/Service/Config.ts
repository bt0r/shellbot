import {TextChannel} from "discord.js";
import * as fs from "fs";
import {resolve} from "path";
import {Inject} from "typescript-ioc";
import * as YAML from "yamljs";
import {Logger} from "./Logger";

export class Config {
    public version = "0.1.0";
    public static PATH = resolve("config/config.yml");
    /**
     * Config
     * @type {Object}
     * @private
     */
    private _config: any;
    /**
     * Logger
     * @type Logger
     * @private
     */
    @Inject
    private logger: Logger;

    public constructor() {
        if (!fs.existsSync(Config.PATH)) {
            this.init();
        }
        this.config = YAML.load(Config.PATH);
        this.version = this.config.version;
    }
    /**
     * Return the shellbot config
     * @returns {Object}
     */
    public get config(): any {
        return this._config;
    }

    public set config(config) {
        this._config = config;
    }
    /**
     * Check if a command is enabled on a a specific channel
     * @param {string} command
     * @param {string} channel
     * @returns {boolean}
     */
    public isCommandEnabled(command: string, channel: TextChannel) {
        const channelConfig = this.channelConfig(channel);
        return channelConfig && channelConfig.commands[command];
    }

    /**
     * Return the channel config if exists
     * @param channel
     * @return any
     */
    public channelConfig(channel: TextChannel): any {
        const channelNameAndPosition = channel.name + "_" + channel.position;
        const channelId = channel.id;
        let channelConfig: any = null;
        if (this._config.channels[channelId]) {
            channelConfig = this._config.channels[channelId];
        } else if (this._config.channels[channelNameAndPosition]) {
            channelConfig = this._config.channels[channelNameAndPosition];
        } else {
            return null;
        }
        return channelConfig;
    }

    public write(config = this.config, destinationPath = Config.PATH) {
        const yamlStr = YAML.stringify(config, 20);
        fs.writeFile(destinationPath, yamlStr, (e) => {
            if (e) {
                this.logger.error(`Cannot write file ${destinationPath}, error: ${e.message}`);
                return false;
            }

            return true;
        });
    }

    public init() {
        fs.copyFile(Config.PATH + ".dist", Config.PATH, (error) => {
            if (error) {
                this.logger.error("Can't init the config, error:" + error.message);
            }
        });
    }
}
