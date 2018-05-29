'use strict';

import {AbstractCommand} from "./AbstractCommand";

export class Chuck extends AbstractCommand {
    static NAME: string = "chuck";
    public toto = "NO";

    constructor() {
        super();
        this.name = Chuck.NAME;
    }

    do() {
        console.log('Chuck is running .... FASTER THAN EVERYONE !!! ');
        console.log(this.toto);
        this.toto = "YES";
    }
}
