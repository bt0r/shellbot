import {Inject, Singleton} from "typescript-ioc";
import {ShellbotClient} from "../ShellbotClient";
import {Config} from "./Config";
import {Logger} from "./Logger";

@Singleton
export class StatusService {
    public shellbotClient: ShellbotClient;

    @Inject
    private logger: Logger;
    @Inject
    private config: Config;

    public constructor(shellbotClient: ShellbotClient) {
        this.shellbotClient = shellbotClient;
    }

    public logged(): void {
        this.activity("🔑 Logged ! v:" + Config.version);
    }

    public ready(): void {
        this.activity("✅ Ready ! v:" + Config.version);
    }

    public error(): void {
        this.activity("❌ Error ! v:" + Config.version);
    }

    public activity(activity: string) {
        this.shellbotClient.discordClient.user.setActivity(activity).catch((reason) => {
            this.logger.error(`Cannot change activity '${activity}', reason: ${reason}`);
        });
    }
}
