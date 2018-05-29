'use strict'
import {Chuck} from "./Chuck";
import {Listener} from "../Listener/Listener";
import {User} from "discord.js";
import {AbstractCommand} from "./AbstractCommand";

export class CommandFactory{
    static instantiate(commandName: string,author: User){
        let commandFound = null;
        switch(commandName){
            case Chuck.NAME:
                console.log('CHUCK FOUND');
                commandFound = new Chuck();
                break;
        }
        if(commandFound !== null){
            this.send(commandFound,author);
        }
    }
    private static send(command: AbstractCommand,author: User){
        command = command.worker();
        let emitter = Listener.EMITTER;
        emitter.on('shellbot.command',function(data){
            console.log("OK BABY");
            console.log(data.command.name);
        });
        emitter.emit("shellbot.command",{
            command: command,
            author: author
        });

    }
}