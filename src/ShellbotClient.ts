'use strict'
import {Client}   from "discord.js";
import * as YAML  from "yamljs";
import {Listener} from "./Listener/Listener";
import {Logger}   from "./Service/Logger";


export class ShellbotClient {
    /**
     * Config file
     * @type {any}
     * @private
     */
    private _config = YAML.load('config/config.yml');

    /**
     * Discord.JS bot client
     * @type {"discord.js".Client}
     * @private
     */
    private _discordClient: Client = new Client();

    /**
     * Logger
     * @type {Logger}
     * @private
     */
    private _logger: Logger = Logger.getInstance();

    constructor() {
        this.logger.info('Shellbot is starting...')

        this.discordClient.login(this.config.parameters.token).then(() => {
            this.logger.info('Shellbot logged !');
        }).catch(() => {
            this.logger.error('Shellbot cannot login :\'( ');
        });
        // Listen shellbot client
        new Listener(this);
        this.logger.info('Shellbot started');
    }

    /**
     * Return a discordJS client
     * @returns {"discord.js".Client}
     */
    public get discordClient() {
        return this._discordClient;
    }

    /**
     * Return the shellbot config
     * @returns {any}
     */
    public get config() {
        return this._config;
    }

    private get logger() {
        return this._logger;
    }
}