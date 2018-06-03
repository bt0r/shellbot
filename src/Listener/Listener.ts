'use strict';

import {Channel, GuildMember, Message, User} from "discord.js";
import {Logger} from "../Service/Logger";
import {ShellbotClient} from "../ShellbotClient";
import {CommandEmitter} from "./CommandEmitter";
import {CommandFactory} from "../Commands/CommandFactory";


export class Listener {
    /**
     * Log4js Logger
     */
    private _logger: any;

    /**
     * Shellbot Client
     */
    private _shellbotClient: ShellbotClient;

    /**
     * Static CommandEmitter instance
     */
    public static EMITTER: CommandEmitter;


    constructor(shellbotClient: ShellbotClient) {
        Listener.getInstance();
        this.logger         = Logger.getInstance();
        this.shellbotClient = shellbotClient;
        let discordClient   = this.shellbotClient.discordClient;
        discordClient.on('ready', () => this.ready());
        discordClient.on('message', message => this.message(message));
        discordClient.on('guildMemberAdd', member => this.guildMemberAdd(member));
        discordClient.on('typingStart', (channel, user) => this.typingStart(channel, user));
        discordClient.on('messageDelete', message => this.messageDelete(message));
        discordClient.on('disconnect', closeEvent => this.disconnect(closeEvent));
    }

    private ready(): void {
        this.logger.info("Ready !");
    }

    private disconnect(closeEvent: CloseEvent): void {
        this.logger.info('[DISCONNECT] Bot is disconnected');
    }

    private message(message: Message): void {
        this.logger.debug(`[NEW] ${message.author.username}: ${message.content}`);
        // Check if command exists
        let commandPrefix = this.shellbotClient.config.parameters.commandPrefix;
        let content       = message.content;

        if (content.length > 0 && commandPrefix === content.charAt(0)) {
            // It's a command !
            let [command, ...args] = content.split(' ');
            let [_, commandName]   = command.split(commandPrefix);

            // Try to send the command
            CommandFactory.instantiate(commandName,message);
        }
    }

    private messageUpdate(oldMessage: Message, newMessage: Message): void {
        this.logger.debug(`[EDIT] ${oldMessage.author.username}: ${oldMessage.content} >>> ${newMessage.content}`);
    }

    private messageDelete(messageDelete: Message): void {
        this.logger.info(`[DELETE] ${messageDelete.author.username}: ${messageDelete.content}`)
    }

    private guildMemberAdd(member: GuildMember): void {
        this.logger.info(`[MEMBER-JOIN] ${member.user.username} joined the server.`)
    }

    private guildMemberRemove(member: GuildMember): void {
        this.logger.info(`[MEMBER-QUIT] ${member.user.username} quit the server.`)
    }

    private typingStart(channel: Channel, user: User): void {
        this.logger.debug('User ' + user.username + ' is typing')
    }

    get logger(): Logger {
        return this._logger;
    }

    set logger(logger) {
        this._logger = logger;
    }

    get shellbotClient(): ShellbotClient {
        return this._shellbotClient;
    }

    set shellbotClient(shellbotClient) {
        this._shellbotClient = shellbotClient;
    }

    public static getInstance() {
        if (!this.EMITTER) {
            this.EMITTER = new CommandEmitter();
        }

        return this.EMITTER;
    }
}