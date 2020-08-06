import {Client, DMChannel, GuildMember, Message, MessageReaction, TextChannel, User as DiscordUser} from "discord.js";
import {Inject} from "typescript-ioc";
import {User} from "../Entity/User";
import {UserFactory} from "../Entity/UserFactory";
import {UserRepository} from "../Repository/UserRepository";
import {Config} from "../Service/Config";
import {Database} from "../Service/Database";
import {Logger} from "../Service/Logger";

export class Welcome {
    @Inject
    private _config: Config;
    @Inject
    private _logger: Logger;
    @Inject
    private _database: Database;
    private _client: Client;
    /**
     * Config object for Welcome feature
     */
    private _welcomeConfig: any;

    public get config() {
        return this._config;
    }

    public get logger() {
        return this._logger;
    }

    public get welcomeConfig() {
        return this._welcomeConfig;
    }

    public set welcomeConfig(welcomeConfig: any) {
        this._welcomeConfig = welcomeConfig;
    }

    public constructor(discordClient: Client) {
        this.welcomeConfig = this.config.config.parameters.welcome;
        this._client = discordClient;
    }

    /**
     * Send the welcome message in DM
     */
    public sendMessage(member: GuildMember) {
        const welcomeConfig = this.welcomeConfig;
        if (welcomeConfig && welcomeConfig.enabled) {
            setTimeout(() => {
                // @ts-ignore
                this._client.channels.get(welcomeConfig.channelId).send(welcomeConfig.message).then(async (message) => {
                    if (message instanceof Message) {
                        const reactions = welcomeConfig.reactions;
                        for await (const reactionName of Object.keys(reactions)) {
                            const reaction: any = reactions[reactionName];
                            if (reaction.role && reaction.emoji) {
                                const emojiValue = reaction.emoji.toString().trim();
                                const emojiId = Number(emojiValue);
                                if (isNaN(emojiId)) {
                                    await message.react(reaction.emoji);
                                } else {
                                    const customEmoji = this._client.emojis.get(emojiValue);
                                    if (customEmoji !== undefined) {
                                        await message.react(customEmoji);
                                    } else {
                                        this.logger.error(`Cannot find emoji for reaction: ${reactionName}`);
                                    }
                                }
                            }
                        }
                    }
                });
            }, 2000);
        }
    }

    /**
     * Add role when user clicks on a reaction
     */
    public addRole(messageReaction: MessageReaction, user: DiscordUser): void {
        this.changeRole(messageReaction, user, "add");
    }

    /**
     * Remove role when user clicks on a reaction
     */
    public removeRole(messageReaction: MessageReaction, user: DiscordUser): void {
        this.changeRole(messageReaction, user, "remove");
    }

    private async changeRole(messageReaction: MessageReaction, user: DiscordUser, action: string) {
        if (messageReaction.message.channel instanceof TextChannel && user !== messageReaction.message.author) {
            if (this.welcomeConfig && this.welcomeConfig.enabled) {
                const guilds = this._client.guilds;
                const guild = guilds.first();
                const guildMember = guild.members.get(user.id);
                // Fetch role by the emoji
                const reactions = this.welcomeConfig.reactions;
                for (const reactionName of Object.keys(reactions)) {
                    const reaction: any = reactions[reactionName];
                    const reactionEmoji = messageReaction.emoji;
                    if (reactionEmoji.name === reaction.emoji || reactionEmoji.id === reaction.emoji) {
                        switch (action) {
                            // case "remove":
                            //     const removeRoleReason = `Role ${reactionName} automatically removed to user ${user.username}`;
                            //     if (guildMember !== undefined) {
                            //         guildMember.removeRole(reaction.role, removeRoleReason).then(async () => {
                            //             this.logger.info(removeRoleReason);
                            //             guildMember.send(this.welcomeConfig.success_removed_message.replace("%role%", reactionName));
                            //             await this.userRegistered(guildMember.user);
                            //         }).catch(() => {
                            //             this.logger.error(`Cannot automatically remove role ${reactionName} to user ${user.username}`);
                            //             guildMember.send(this.welcomeConfig.error_removed_message.replace("%role%", reactionName));
                            //         });
                            //     }
                            //     break;
                            case "add":
                                const addRoleReason = `Role ${reactionName} automatically added to user ${user.username}`;
                                if (guildMember !== undefined) {
                                    guildMember.addRole(reaction.role, addRoleReason).then(async () => {
                                        this.logger.info(addRoleReason);
                                        // guildMember.send(this.welcomeConfig.success_message.replace("%role%", reactionName));
                                        await this.userRegistered(guildMember.user);
                                        await messageReaction.message.delete(0);
                                    }).catch(() => {
                                        this.logger.error(`Cannot automatically add role ${reactionName} to user ${user.username}`);
                                        guildMember.send(this.welcomeConfig.error_message.replace("%role%", reactionName));
                                    });

                                }
                                break;
                        }
                        break;
                    }
                }
            }
        }
    }

    private async userRegistered(discordUser: DiscordUser) {
        const user = UserFactory.create(discordUser);
        const userRegisteredConfig = this.welcomeConfig.user_registered;
        const channel = this._client.channels.get(userRegisteredConfig.channel_id);
        if (user instanceof User
            && userRegisteredConfig
            && userRegisteredConfig.message
            && userRegisteredConfig.channel_id
            && channel instanceof TextChannel
        ) {
            this.logger.info(`Trying to register user ${user.name}.`);
            const userRepo = await this._database.manager.getCustomRepository(UserRepository);
            const userCreated = await userRepo.findOrCreate(user);
            if (userCreated.createdOn === null) {
                userCreated.createdOn = new Date();
                const logger = this.logger;
                userRepo.save(userCreated).then(() => {
                    logger.info(`User ${userCreated.name} registered.`);
                    channel.send(userRegisteredConfig.message.replace("%user%", `<@${userCreated.discordId}>`));
                });
            }
        }
    }
}
