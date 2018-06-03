'use strict'
import {Chuck} from "./Chuck";
import {Listener} from "../Listener/Listener";
import {Message, User} from "discord.js";
import {AbstractCommand} from "./AbstractCommand";
import {Container} from "typescript-ioc";
import {Config} from "../Service/Config";

export class CommandFactory{
    static instantiate(commandName: string,message: Message){
        let config = Container.get(Config);
        let commandFound = null;
        switch(commandName){
            case Chuck.NAME:
                commandFound = new Chuck();
                break;
        }
        if(commandFound !== null && config.isCommandEnabled(commandName,message.channel)){
            this.send(commandFound,message.author);
        }
    }
    private static send(command: AbstractCommand,author: User){
        command = command.worker();
        let emitter = Listener.getInstance();
        emitter.on('shellbot.command',function(data){
            console.log(data.command.name);
            console.log(data.command.toto);
        });
        emitter.emit("shellbot.command",{
            command: command,
            author: author
        });
    }
}