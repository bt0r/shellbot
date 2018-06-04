'use strict'
import {Chuck}           from "./Chuck";
import {Listener}        from "../Listener/Listener";
import {Message}         from "discord.js";
import {AbstractCommand} from "./AbstractCommand";
import {Container}       from "typescript-ioc";
import {Config}          from "../Service/Config";

export class CommandFactory {
    static instantiate(commandName: string, message: Message) {
        let config       = Container.get(Config);
        let commandFound = null;
        switch (commandName) {
            case Chuck.NAME:
                commandFound = new Chuck();
                break;
        }
        if (commandFound !== null && config.isCommandEnabled(commandName, message.channel)) {
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