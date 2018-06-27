"use strict";
import {Message, TextChannel} from "discord.js";
import {Container} from "typescript-ioc";
import {Listener} from "../Listener/Listener";
import {Config} from "../Service/Config";
import {AbstractCommand} from "./AbstractCommand";
import {Bonjour} from "./Bonjour";
import {Boobs} from "./Boobs";
import {Butts} from "./Butts";
import {Cat} from "./Cat";
import {Chuck} from "./Chuck";
import {Qwant} from "./Qwant";
import {Weather} from "./Weather";

export class CommandFactory {
    public static instantiate(commandName: string, message: Message) {
        const config = Container.get(Config);
        const channel = message.channel as TextChannel;
        let commandFound = null;
        switch (commandName) {
            case Chuck.NAME:
                commandFound = new Chuck();
                break;
            case Boobs.NAME:
                commandFound = new Boobs();
                break;
            case Butts.NAME:
                commandFound = new Butts();
                break;
            case Qwant.NAME:
                commandFound = new Qwant();
                break;
            case Cat.NAME:
                commandFound = new Cat();
                break;
            case Weather.NAME:
                commandFound = new Weather();
                break;
            case Bonjour.NAME:
                commandFound = new Bonjour();
                break;
        }
        if (commandFound !== null && config.isCommandEnabled(commandName, channel)) {
            const configChannel = config.config.channels[channel.name + "_" + channel.position];
            const commandConfig = configChannel.modules_enabled[commandName];
            commandFound.config = commandConfig;

            this.send(commandFound, message);
        }
    }

    private static send(command: AbstractCommand, message: Message) {
        command = command.worker(message);
        const emitter = Listener.getInstance();

        emitter.emit("shellbot.command", {
            author: message.author,
            command,
        });
    }
}
