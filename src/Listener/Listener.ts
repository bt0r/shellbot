"use strict";

import {Channel, Client, GuildMember, Message, MessageReaction, TextChannel, User} from "discord.js";
import {Container, Inject} from "typescript-ioc";
import {CommandFactory} from "../Commands/CommandFactory";
import {Welcome} from "../Commands/Welcome";
import {User as DBUser} from "../Entity/User";
import {UserRepository} from "../Repository/UserRepository";
import {Config} from "../Service/Config";
import {Database} from "../Service/Database";
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
    @Inject
    private _logger: Logger;

    /**
     * Shellbot Client
     */
    private _shellbotClient: ShellbotClient;

    /**
     * Discord client
     */
    private _discordClient: Client;

    @Inject
    private _database: Database;

    constructor(shellbotClient: ShellbotClient) {
        Listener.getInstance();
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
        discordClient.on("presenceUpdate", (oldMember, newMember) => this.presenceUpdate(oldMember, newMember));
        discordClient.on("error", (error) => this.error(error));
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
        this.logger.info(`[NEW] ${message.author.username}: ${message.content}`);
        // Check if there is a restriction
        const config: Config = Container.get(Config);
        const channel = message.channel as TextChannel;
        const channelConfig = config.channelConfig(channel);
        const discordClient = this.shellbotClient.discordClient;
        if (message.author !== discordClient.user && channelConfig && channelConfig.message_restriction &&
            channelConfig.message_restriction.error_message &&
            channelConfig.message_restriction.regexp) {
            const regexp = new RegExp(channelConfig.message_restriction.regexp);
            if (!message.content.match(regexp)) {
                message.author.send(channelConfig.message_restriction.error_message.replace("%messageContent%", message.content)).then(() => {
                    message.delete();
                });
            }
        }
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
        this.logger.info(`[EDIT] ${oldMessage.author.username}: ${oldMessage.content} >>> ${newMessage.content}`);
    }

    private messageDelete(messageDelete: Message): void {
        this.logger.info(`[DELETE] ${messageDelete.author.username}: ${messageDelete.content}`);
    }

    private guildMemberAdd(member: GuildMember): void {
        this.logger.info(`[MEMBER-JOIN] ${member.user.username}[${member.user.id}] joined the server.`);
        // Send welcome message
        const welcome = new Welcome();
        const discordClient = this.shellbotClient.discordClient;
        welcome.sendMessage(member, discordClient);
    }

    private guildMemberRemove(member: GuildMember): void {
        this.logger.info(`[MEMBER-QUIT] ${member.user.username}[${member.user.id}] quit the server.`);
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

    private async presenceUpdate(oldMember: GuildMember, newMember: GuildMember) {
        this.logger.info("[STATUS] User " + oldMember.user.username + " is now " + newMember.user.presence.status);

        let user = new DBUser();
        user.discordId = newMember.user.id;
        user.name = newMember.user.username;
        user = await this._database.manager.getCustomRepository(UserRepository).findOrCreate(user);
        user.status = newMember.user.presence.status;
        this._database.manager.save(user);
    }

    private error(error: Error) {
        this.logger.error(error.message);
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
