export namespace DiscordBot {

    interface IHandlerMap {
        [key: string]: ICommand;
    }

    export interface ICommand {
        COMMAND: string;
        new(...args: any[]);
    }

    export function Command(klass: ICommand) {
        Listener.register(klass.COMMAND, klass);
    }

    export class Listener {
        static PREFIX = '!';
        static commandHandlers: IHandlerMap = {};

        static register(command: string, handler: ICommand) {
            Listener.commandHandlers[command] = handler;
        }

        static handleMessage(message: string) {
            if (message.indexOf(Listener.PREFIX) !== 0) {
                return;
            }

            const [commandString, ...args] = message.split(' ');
            const [_, cmd] = commandString.split('!');

            if (Listener.commandHandlers[cmd]) {
                new Listener.commandHandlers[cmd](...args);
            }
        }
    }
}



DiscordBot.Listener.handleMessage('!chuck bt0r');
DiscordBot.Listener.handleMessage('!test');
DiscordBot.Listener.handleMessage('!qdzqzd');