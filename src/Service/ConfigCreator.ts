import {description, program, version} from "commander-ts";
import {checkbox, confirm, input, prompt} from "typed-prompts";
import {Inject} from "typescript-ioc";
import {Config} from "./Config";
import {DependencyConfigurator} from "./DependencyConfigurator";

interface ConfigTemplate {
    discordToken: string;
    commandPrefix: string;
    welcomeCommandEnabled: boolean;
    commandsToEnable: boolean;
    channels: ChannelTemplate[];
}

interface ChannelTemplate {
    name: string;
    commands: string[];
}

interface ChannelConfigTemplate {

}

@program()
@version(Config.version)
@description("Build a config file easily !")
export class ConfigCreator {
    @Inject
    private static config: Config;

    public constructor() {
        DependencyConfigurator.configureCommand();
    }

    public static writeConfig(configTemplate: ConfigTemplate) {
        const config = ConfigCreator.config;
        const configValues = config.config;
        configValues.parameters.token = configTemplate.discordToken ? configTemplate.discordToken : null;
        configValues.parameters.commandPrefix = configTemplate.commandPrefix ? configTemplate.commandPrefix : null;
        for (const channel of configTemplate.channels) {
            const commands: any = {};

            for (const command in channel.commands) {
                if (command as string) {
                    const commandName: string = channel.commands[command];
                    commands[commandName] = {enabled: true};
                }
            }
            configValues.channels[channel.name] = {
                commands,
            };
        }
        config.write(configValues);
    }

    public async run() {
        const config = ConfigCreator.config;
        const configToCreate: ConfigTemplate = await prompt<ConfigTemplate>([
            input("discordToken", "Please fill your discord token:"),
            input("commandPrefix", "Which prefix commands do you want to use ", {default: "!"}),

        ]);
        if (configToCreate.discordToken && configToCreate.discordToken.trim().length > 0) {
            configToCreate.discordToken = configToCreate.discordToken.trim();
        }
        if (configToCreate.commandPrefix && configToCreate.commandPrefix.trim().length > 0) {
            configToCreate.discordToken = configToCreate.discordToken.trim();
        }
        configToCreate.channels = [];
        let anotherChannel = true;
        while (anotherChannel) {
            const addChannel = await prompt([
                confirm("continue", "Do you want to enabled commands for a channel ?", {default: true}),
            ]);
            if (addChannel.continue) {
                const channel = await prompt<ChannelTemplate>([
                    input("name", "What's the channel ID or the name and position of the channel ? (Example: 01234567890 or test_2 where _2 mean the channel position)"),
                    checkbox("commands", "Which commands do you want to use ?", [
                        {name: "chuck"}, {name: "boobs"}, {name: "qwant"}, {name: "quote"}, {name: "bonjour"}, {name: "stats"},
                    ]),
                ]);
                configToCreate.channels.push(channel);
            } else {
                anotherChannel = false;
            }
        }
        ConfigCreator.writeConfig(configToCreate);
    }
}

new ConfigCreator();
