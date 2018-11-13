import {Channel, Client, Collection, Snowflake, TextChannel} from "discord.js";
import {scheduleJob} from "node-schedule";
import {Inject} from "typescript-ioc";
import {ScheduleFactory} from "../Schedule/ScheduleFactory";
import {Config} from "./Config";

export class Scheduler {
    @Inject
    private _config: Config;
    private _textChannels: TextChannel[];
    private readonly _discordClient: Client;

    public constructor(discordClient: Client) {
        this._discordClient = discordClient;
        this._textChannels = this._discordClient.channels.findAll("type", "text") as TextChannel[];
        this.start();
    }

    public start() {
        const channelsConfig = this._config.config.channels;
        for (const channelConfigName in channelsConfig) {
            const channelConfig = channelsConfig[channelConfigName];
            const [channelName, channelPosition] = channelConfigName.split("_");
            const schedulesConfig = channelConfig.schedules;
            if (schedulesConfig !== undefined && schedulesConfig.length > 0) {
                for (const scheduleConfig of schedulesConfig) {
                    const schedule = ScheduleFactory.create(scheduleConfig);
                    const channel = this._textChannels.filter((textChannel) => (textChannel.name === channelName && textChannel.position === Number(channelPosition)));
                    if (schedule !== null) {
                        schedule.discordClient = this._discordClient;
                        scheduleJob(scheduleConfig.cron_rule, () => {
                            schedule.do(channel[0]);
                        });
                    }
                }
            }
        }
    }
}
