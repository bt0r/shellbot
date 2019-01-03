import {description, program, version} from "commander-ts";
import {input, prompt} from "typed-prompts";
import {Container} from "typescript-ioc";
import {Config} from "./Config";
import {DependencyConfigurator} from "./DependencyConfigurator";

interface ConfigTemplate {
    discordToken: string;
}

@program()
@version(Config.version)
@description("Build a config file easily !")
export class ConfigCreator {
    private readonly config: Config;

    public constructor() {
        DependencyConfigurator.configureCommand();
        this.config = Container.get(Config);
    }

    public run() {
        prompt<ConfigTemplate>([input("discordToken", "Please fill your discord token:")]).then((answer) => {
            if (answer.discordToken && answer.discordToken.length > 0) {
                answer.discordToken = answer.discordToken.trim();
            }
            console.log(answer);
        });

    }

    /*
     * - Discord Token
     * - command prefix
     * - Message d'accueil ?
     * - Activate all command ?
     */
}

const cc = new ConfigCreator();
