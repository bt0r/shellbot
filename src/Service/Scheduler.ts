import {Client, TextChannel} from "discord.js";
import {scheduleJob} from "node-schedule";
import {Inject} from "typescript-ioc";
import {v4 as uuid} from "uuid";
import {ScheduleFactory} from "../Schedule/ScheduleFactory";
import {Config} from "./Config";
import {Logger} from "./Logger";

export class Scheduler {
    @Inject
    private _config: Config;
    @Inject
    private _logger: Logger;
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
            if (channelConfigName as string) {
                const channelConfig = channelsConfig[channelConfigName];
                const [channelName, channelPosition] = channelConfigName.split("_");
                const schedulesConfig = channelConfig.schedules;
                if (schedulesConfig !== undefined && schedulesConfig.length > 0) {
                    for (const scheduleConfig of schedulesConfig) {
                        const schedule = ScheduleFactory.create(scheduleConfig);
                        const channel = this._textChannels.filter((textChannel) => ((textChannel.name === channelName && textChannel.position === Number(channelPosition))) || textChannel.id === channelConfigName);
                        if (schedule !== null && scheduleConfig.enabled === true) {
                            schedule.discordClient = this._discordClient;
                            const scheduleUuid = uuid();
                            const scheduleName = schedule.name + "_" + scheduleUuid;
                            scheduleJob(scheduleName, scheduleConfig.cron_rule, () => {
                                this._logger.info(`[SCH:${schedule.name}][${scheduleUuid}] Task launched`);
                                schedule.do(channel[0]);
                            });
                        }
                    }
                }
            }
        }
    }
}
