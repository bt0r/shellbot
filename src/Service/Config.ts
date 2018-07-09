"use strict";
import {TextChannel} from "discord.js";
import {Inject} from "typescript-ioc";
import * as YAML from "yamljs";

export class Config {
    @Inject
    /**
     * Config
     * @type {Object}
     * @private
     */
    private _config = YAML.load("config/config.yml");

    /**
     * Return the shellbot config
     * @returns {Object}
     */
    public get config(): object {
        return this._config;
    }

    /**
     * Check if a command is enabled on a a specific channel
     * @param {string} command
     * @param {string} channel
     * @returns {boolean}
     */
    public isCommandEnabled(command: string, channel: TextChannel) {
        const configChannel = this._config.channels[channel.name + "_" + channel.position];
        return configChannel && configChannel.modules_enabled[command];
    }
}
