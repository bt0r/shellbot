"use strict";

import {Channel, Client, GuildMember, Message, MessageReaction, User} from "discord.js";
import {CommandFactory} from "../Commands/CommandFactory";
import {Welcome} from "../Commands/Welcome";
import {Logger} from "../Service/Logger";
import {ShellbotClient} from "../ShellbotClient";
import {CommandEmitter} from "./CommandEmitter";

export class Listener {
    /**
     * Static CommandEmitter instance
     */
    public static EMITTER: CommandEmitter;

    /**
     * Log4js Logger
     */
    private _logger: any;

    /**
     * Shellbot Client
     */
    private _shellbotClient: ShellbotClient;

    /**
     * Discord client
     */
    private _discordClient: Client;

    constructor(shellbotClient: ShellbotClient) {
        Listener.getInstance();
        this.logger         = Logger.getInstance();
        this.shellbotClient = shellbotClient;
        const discordClient   = this.shellbotClient.discordClient;
        discordClient.on("ready", () => this.ready());
        discordClient.on("message", (message) => this.message(message));
        discordClient.on("guildMemberAdd", (member) => this.guildMemberAdd(member));
        discordClient.on("guildMemberRemove", (member) => this.guildMemberRemove(member));
        discordClient.on("typingStart", (channel, user) => this.typingStart(channel, user));
        discordClient.on("messageDelete", (message) => this.messageDelete(message));
        discordClient.on("disconnect", (closeEvent) => this.disconnect(closeEvent));
        discordClient.on("messageReactionAdd", (messageReaction, user) => this.messageReactionAdd(messageReaction, user));
        discordClient.on("messageReactionRemove", (messageReaction, user) => this.messageReactionRemove(messageReaction, user));
    }

    public static getInstance() {
        if (!this.EMITTER) {
            this.EMITTER = new CommandEmitter();
        }

        return this.EMITTER;
    }

    private ready(): void {
        this.logger.info("Ready !");
    }

    private disconnect(closeEvent: CloseEvent): void {
        this.logger.info("[DISCONNECT] Bot is disconnected");
    }

    private message(message: Message): void {
        this.logger.debug(`[NEW] ${message.author.username}: ${message.content}`);
        // Check if command exists
        const commandPrefix = this.shellbotClient.config.parameters.commandPrefix;
        const content       = message.content;

        if (content.length > 0 && commandPrefix === content.charAt(0)) {
            // It's a command !
            const [command, ...args] = content.split(" ");
            const [_, commandName]   = command.split(commandPrefix);

            // Try to send the command
            CommandFactory.instantiate(commandName, message);
        }
    }

    private messageUpdate(oldMessage: Message, newMessage: Message): void {
        this.logger.debug(`[EDIT] ${oldMessage.author.username}: ${oldMessage.content} >>> ${newMessage.content}`);
    }

    private messageDelete(messageDelete: Message): void {
        this.logger.info(`[DELETE] ${messageDelete.author.username}: ${messageDelete.content}`);
    }

    private guildMemberAdd(member: GuildMember): void {
        this.logger.info(`[MEMBER-JOIN] ${member.user.username} joined the server.`);
        // Send welcome message
        const welcome = new Welcome();
        const discordClient = this.shellbotClient.discordClient;
        welcome.sendMessage(member, discordClient);
    }

    private guildMemberRemove(member: GuildMember): void {
        this.logger.info(`[MEMBER-QUIT] ${member.user.username} quit the server.`);
    }

    private typingStart(channel: Channel, user: User): void {
        this.logger.debug("User " + user.username + " is typing");
    }

    private messageReactionAdd(messageReaction: MessageReaction, user: User): void {
        const welcome = new Welcome();
        const discordClient = this.shellbotClient.discordClient;
        welcome.addRole(messageReaction, user, discordClient);
    }

    private messageReactionRemove(messageReaction: MessageReaction, user: User): void {
        const welcome = new Welcome();
        const discordClient = this.shellbotClient.discordClient;
        welcome.removeRole(messageReaction, user, discordClient);
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
}
