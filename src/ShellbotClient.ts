'use strict'
import {Client} from "discord.js";
import * as YAML from "yamljs";
import {Listener} from "./Listener";
import {Logger} from "./Logger";


export class ShellbotClient {
    /**
     * Config file
     */
    private _config = YAML.load('config/config.yml');

    /**
     * Discord.JS bot client
     */
    private _discordClient: Client = new Client();

    constructor() {
        let logger = new Logger();
        logger.info('Shellbot is starting...')

        this.discordClient.login(this.config.parameters.token).then(() => {
            logger.info('Shellbot logged !')
        }).catch(()=>{
            logger.error('Shellbot cannot login :\'( ')
        });
        // Listen discord client
        new Listener(this.discordClient);
        logger.info('Shellbot started');
    }

    get discordClient() {
        return this._discordClient;
    }

    get config() {
        return this._config;
    }
}