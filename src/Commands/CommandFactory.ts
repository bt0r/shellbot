'use strict'
import {Chuck}           from "./Chuck";
import {Listener}        from "../Listener/Listener";
import {Message}         from "discord.js";
import {AbstractCommand} from "./AbstractCommand";
import {Container}       from "typescript-ioc";
import {Config}          from "../Service/Config";
import {Boobs}           from "./Boobs";
import {Qwant}           from "./Qwant";
import {Cat}             from "./Cat";
import {Weather}         from "./Weather";

export class CommandFactory {
    static instantiate(commandName: string, message: Message) {
        let config       = Container.get(Config);
        let commandFound = null;
        switch (commandName) {
            case Chuck.NAME:
                commandFound = new Chuck();
                break;
            case Boobs.NAME:
                commandFound = new Boobs();
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
        }
        if (commandFound !== null && config.isCommandEnabled(commandName, message.channel)) {
            let channel       = message.channel;
            let configChannel = config.config.channels[channel.name + "_" + channel.position];
            let commandConfig = configChannel.modules_enabled[commandName];
            commandFound.config = commandConfig;

            this.send(commandFound, message);
        }
    }

    private static send(command: AbstractCommand, message: Message) {
        command     = command.worker(message);
        let emitter = Listener.getInstance();

        emitter.emit("shellbot.command", {
            command: command,
            author: message.author
        });
    }
}