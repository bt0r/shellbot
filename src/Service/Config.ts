"use strict";
import {TextChannel} from "discord.js";
import * as YAML from "yamljs";

export class Config {
    /**
     * Config
     * @type {Object}
     * @private
     */
    private _config;

    public constructor() {
        this.config = YAML.load("config/config.yml");
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
        return channelConfig && channelConfig.modules_enabled[command];
    }

    /**
     * Return the channel config if exists
     * @param channel
     * @return any
     */
    public channelConfig(channel: TextChannel): any {
        return this._config.channels[channel.name + "_" + channel.position];
    }
}
