import Command from "./test";
import ICommand from "./test";

@Command
export class Chuck extends ICommand {
    static COMMAND = 'chuck';
    private name: string;

    constructor(name: string) {
        this.name = name;
        console.log(this.name);
    }
}

@Command
export class Test extends ICommand {
    static COMMAND = 'test';

    constructor() {
        console.log('test');
    }
}
