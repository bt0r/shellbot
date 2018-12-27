import {Message, RichEmbed} from "discord.js";
import {Inject} from "typescript-ioc";
import {Config} from "../Service/Config";
import {AbstractCommand} from "./AbstractCommand";

export class TwitterAdmin extends AbstractCommand {
    @Inject
    protected configAdmin: Config;

    public static NAME: string = "twitterAdmin";
    public static NAME_ALIAS: string = "twa";

    constructor() {
        super();
        this.name = "twitterAdmin";
    }
    public do(message: Message) {
        const args = message.content.split(" ");
        if (args.length > 0) {

            switch (args[1]) {
                case "allow":
                    if (args[2] && args[3] && args[4]) {
                       switch (args[2]) {
                           case "add":
                               // !twitterAdmin allow add <channel> <expression>
                               this.add(args[3], args[4], true);
                               break;
                           case "del":
                               // !twitterAdmin allow del <channel> <expression>
                               this.del(args[3], args[4], true);
                               break;
                       }
                    }
                    break;
                case "deny":
                    if (args[2] && args[3] && args[4]) {
                        switch (args[2]) {
                            case "add":
                                // !twitterAdmin deny add <channel> <expression>
                                this.add(args[3], args[4], false);
                                break;
                            case "del":
                                // !twitterAdmin deny del <channel> <expression>
                                this.del(args[3], args[4], false);
                                break;
                        }
                    }
                case "help":
                    message.reply(this.help()).catch((reason) => {
                        this.error("Error with help command, error: " + reason);
                    });
                    break;
                case "account":
                    switch (args[2]) {
                        case "add":
                            // !twa account add <channel> <account>
                            this.addAccount(args[3], args[4]);
                            break;
                        case "del":
                            // !twa account del <channel> <account>
                            this.delAccount(args[3], args[4]);
                            break;
                    }
                    break;
                case "config":
                    const listEmbed = this.list();
                    for (const scheduleEmbed of listEmbed) {
                        message.reply(scheduleEmbed);
                    }
                    break;
            }
        }
    }

    public list() {
        const channels = this.configAdmin.config.channels;
        const results: any[] = [];
        for (const channel in channels) {
            const channelObject = channels[channel];
            if (channelObject.schedules) {
                for (const schedule of channelObject.schedules) {
                    if (schedule.type === "twitter") {
                        const query = schedule.arguments.query;
                        const accounts = "**Accounts**\n- " + query.values.join("\n- ");
                        let restrictions = null;
                        const resultEmbed = new RichEmbed();
                        resultEmbed.setTitle("Channel: " + channel);
                        resultEmbed.setColor(0xf4424e);

                        if (query.restrictions) {
                            if (query.restrictions.allow) {
                                restrictions = "**Allowed**";
                                let i = 1;
                                for (const allow of query.restrictions.allow) {
                                    restrictions += "\n" + i + ": `" + allow + "`";
                                    i++;
                                }
                            }
                            if (query.restrictions.deny) {
                                restrictions += "\n\n**Denied**";
                                let i = 1;
                                for (const deny of query.restrictions.deny) {
                                    restrictions += "\n" + i + ": `" + deny + "`";
                                    i++;
                                }
                            }
                        }
                        resultEmbed.setDescription(`${accounts}\n\n${restrictions}`);
                        results.push(resultEmbed);
                    }
                }
            }
        }
        return results;
    }

    public addAccount(targetChannel: string, account: string) {
        const config = this.replaceAccount(targetChannel, account, true);
        this.configAdmin.write(config);
    }

    public delAccount(targetChannel: string, account: string) {
        const config = this.replaceAccount(targetChannel, account, false);
        this.configAdmin.write(config);
    }

    private replaceAccount(targetChannel: string, accountName: string, toAdd: boolean) {
        const channels = this.configAdmin.config.channels;
        for (const channel in channels) {
            const channelObject = channels[channel];
            if (channelObject.schedules) {
                for (const schedule of channelObject.schedules) {
                    if (schedule.type === "twitter" && channel === targetChannel) {
                        const query = schedule.arguments.query;
                        const accounts = query.values;
                        if (toAdd) {
                            schedule.arguments.query.values.push(accountName);
                        } else {
                            schedule.arguments.query.values = accounts.filter((account) => account !== accountName);
                        }
                    }
                }
            }
        }
        return this.configAdmin.config;
    }

    public help() {
        const commandPrefix = this.configAdmin.config.parameters.commandPrefix;
        const examples = "* `!twa account add test_12 microsoft` Add microsoft account to the channel test_12\n" +
            "* `!twa account del test_12 apple` Remove microsoft account from the channel test_12\n" +
            "* `!twa allow add general_14 apple` Allow the word apple in the tweets fetched for the channel general_14\n" +
            "* `!twa allow del general++++++_14 apple` Remove the word apple from the allowed word-list of the channel general_14\n" +
            "* `!twa deny add general_14 sex` Remove all tweets containing `sex`\n" +
            "* `!twitterAdmin deny del general_14 iOS` Remove iOS from the 'banned word list' for the channel general_14\n" +
            "* `!twitterAdmin config` Show the twitter config for all channels\n";
        const embed = new RichEmbed();
        embed.setColor(0xf4424e);
        embed.setTitle("Manage the twitter config by adding/removing restrictions or accounts.");
        embed.addField("Accounts", `\`\`\`BASH\n${commandPrefix}<${TwitterAdmin.NAME}|${TwitterAdmin.NAME_ALIAS}> account <add|del> <channel>_<channelPosition> <accountName> \`\`\``);
        embed.addField("Restrictions", `\`\`\`BASH\n${commandPrefix}<${TwitterAdmin.NAME}|${TwitterAdmin.NAME_ALIAS}> <allow|deny> <add|del> <channel>_<channelPosition> <expression> \`\`\``);
        embed.addField("Examples", examples);

        return embed;
    }

    private replaceRules(targetChannel: string, expression: string = "", toAdd: boolean, isAllowed: boolean) {
        const channels = this.configAdmin.config.channels;
        for (const channel in channels) {
            const channelObject = channels[channel];
            if (channelObject.schedules && channel === targetChannel) {
                for (const schedule of channelObject.schedules) {
                    if (schedule.type === "twitter") {
                        const query = schedule.arguments.query;
                        const account = query.values;
                        if (account.length > 0 && query.restrictions) {
                            const restrictions = query.restrictions;
                            let rules = isAllowed ? restrictions.allow : restrictions.deny;
                            if (toAdd) {
                                rules.push(expression);
                            } else {
                                rules = rules.filter((rule) => rule !== expression);
                            }
                            if (isAllowed) {
                                schedule.arguments.query.restrictions.allow = rules;
                            } else {
                                schedule.arguments.query.restrictions.deny = rules;
                            }
                        }
                    }
                }
                break;
            }
        }
        return this.configAdmin.config;
    }

    public add(targetChannel: string, expression: string,  isAllowed: boolean) {
        const config = this.replaceRules(targetChannel, expression, true, isAllowed);
        this.configAdmin.write(config);
    }

    public del(targetChannel: string, expression: string,  isAllowed: boolean) {
        const config = this.replaceRules(targetChannel, expression, false, isAllowed);
        this.configAdmin.write(config);
    }
}
