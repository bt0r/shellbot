import {Client, DMChannel, GuildMember, Message, MessageReaction, User} from "discord.js";
import {Inject} from "typescript-ioc";
import {Config} from "../Service/Config";
import {Logger} from "../Service/Logger";

export class Welcome {
    @Inject
    private _config: Config;
    @Inject
    private _logger: Logger;
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

    public constructor() {
        this.welcomeConfig = this.config.config.parameters.welcome;
    }

    /**
     * Send the welcome message in DM
     */
    public sendMessage(member: GuildMember, discordClient: Client) {
        const welcomeConfig = this.welcomeConfig;
        if (welcomeConfig && welcomeConfig.enabled) {
            member.send(welcomeConfig.message).then(async (message: Message) => {
                const reactions = welcomeConfig.reactions;
                for (const reactionName  in reactions) {
                    const reaction: any = reactions[reactionName];
                    if (reaction.role && reaction.emoji) {
                        const emojiValue = reaction.emoji.toString().trim();
                        const emojiId = Number(emojiValue);
                        if (isNaN(emojiId)) {
                            await message.react(reaction.emoji);
                        } else {
                            const customEmoji = discordClient.emojis.get(emojiValue);
                            if (customEmoji !== undefined) {
                                await message.react(customEmoji);
                            } else {
                                this.logger.error(`Cannot find emoji for reaction: ${reactionName}`);
                            }
                        }
                    }
                }
            });
        }
    }

    /**
     * Add role when user clicks on a reaction
     */
    public addRole(messageReaction: MessageReaction, user: User, discordClient: Client): void {
        this.changeRole(messageReaction, user, discordClient, "add");
    }

    /**
     * Remove role when user clicks on a reaction
     */
    public removeRole(messageReaction: MessageReaction, user: User, discordClient: Client): void {
        this.changeRole(messageReaction, user, discordClient, "remove");
    }

    private changeRole(messageReaction: MessageReaction, user: User, discordClient: Client, action: string) {
        if (messageReaction.message.channel instanceof DMChannel && user !== messageReaction.message.author) {
            if (this.welcomeConfig && this.welcomeConfig.enabled) {
                const guilds = discordClient.guilds;
                const guild = guilds.first();
                const guildMember = guild.members.get(user.id);
                // Fetch role by the emoji
                const reactions = this.welcomeConfig.reactions;
                for (const reactionName in reactions) {
                    const reaction: any = reactions[reactionName];
                    const reactionEmoji = messageReaction.emoji;
                    if (reactionEmoji.name === reaction.emoji || reactionEmoji.id === reaction.emoji) {
                        switch (action) {
                            case "remove":
                                const removeRoleReason = `Role ${reactionName} automatically removed to user ${user.username}`;
                                if (guildMember !== undefined) {
                                    guildMember.removeRole(reaction.role, removeRoleReason).then(() => {
                                        this.logger.info(removeRoleReason);
                                        guildMember.send(this.welcomeConfig.success_removed_message.replace("%role%", reactionName));
                                    }).catch(() => {
                                        this.logger.error(`Cannot automatically remove role ${reactionName} to user ${user.username}`);
                                        guildMember.send(this.welcomeConfig.error_removed_message.replace("%role%", reactionName));
                                    });
                                }
                                break;
                            case "add":
                                const addRoleReason = `Role ${reactionName} automatically added to user ${user.username}`;
                                if (guildMember !== undefined) {
                                    guildMember.addRole(reaction.role, addRoleReason).then(() => {
                                        this.logger.info(addRoleReason);
                                        guildMember.send(this.welcomeConfig.success_message.replace("%role%", reactionName));
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
}
