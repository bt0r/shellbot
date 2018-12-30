import {TextChannel} from "discord.js";
import * as fs from "fs";
import {resolve} from "path";
import {Inject} from "typescript-ioc";
import * as YAML from "yamljs";
import {Logger} from "./Logger";

export class Config {
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
    private _logger: Logger;

    public constructor() {
        this.config = YAML.load(Config.PATH);
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
        return this._config.channels[channel.name + "_" + channel.position];
    }

    public write(config = this.config, destinationPath = Config.PATH) {
        const yamlStr = YAML.stringify(config, 20);
        fs.writeFile(destinationPath, yamlStr, (e) => {
            if (e) {
                this._logger.error(`Cannot write file ${destinationPath}, error: ${e.message}`);
                return false;
            }

            return true;
        });
    }
}
