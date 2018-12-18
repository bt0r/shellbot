import {Message, RichEmbed} from "discord.js";
import {Inject} from "typescript-ioc";
import {Config} from "../Service/Config";
import {AbstractCommand} from "./AbstractCommand";

export class TwitterAdmin extends AbstractCommand {
    @Inject
    protected configAdmin: Config;

    public static NAME: string = "twitterAdmin";

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
            }
            const listEmbed = this.list();
            for (const scheduleEmbed of listEmbed) {
                message.reply(scheduleEmbed);
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
                        resultEmbed.setAuthor("Channel: " + channel);
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

    public addAccount(targetChannel: string, keyword: string) {

    }

    public delAccount(targetChannel: string, keyword: string) {

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
