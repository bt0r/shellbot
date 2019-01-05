import {description, program, version} from "commander-ts";
import {input, prompt} from "typed-prompts";
import {Container} from "typescript-ioc";
import {Config} from "./Config";
import {DependencyConfigurator} from "./DependencyConfigurator";

interface ConfigTemplate {
    discordToken: string;
    commandPrefix: string;
}

@program()
@version(Config.version)
@description("Build a config file easily !")
export class ConfigCreator {
    private static config: Config;

    public constructor() {
        DependencyConfigurator.configureCommand();
        ConfigCreator.config = Container.get(Config);
    }

    public run() {
        const config = ConfigCreator.config;
        config.init();
        prompt<ConfigTemplate>([input("discordToken", "Please fill your discord token:")]).then((answer) => {
            if (answer.discordToken && answer.discordToken.length > 0) {
                answer.discordToken = answer.discordToken.trim();
            }
            prompt<ConfigTemplate>([input("commandPrefix", "Which prefix commands do you want to use ? [!]")]).then((answer2) => {
                if (answer2.commandPrefix && answer2.commandPrefix.length > 0) {
                    answer.commandPrefix = answer2.commandPrefix.trim();

                    console.log(answer);
                    this.writeConfig(answer);
                }
            }).catch((reason) => {
                console.log(reason);
            });

        });
    }

    public writeConfig(configTemplate: ConfigTemplate) {
        const config = ConfigCreator.config;
        config.config.parameters.token = configTemplate.discordToken ? configTemplate.discordToken : null;
        config.config.parameters.commandPrefix = configTemplate.commandPrefix ? configTemplate.commandPrefix : null;
        config.write(config.config);
    }

    /*
     * - Discord Token
     * - command prefix
     * - Message d'accueil ?
     * - Activate all command ?
     */
}

const cc = new ConfigCreator();
