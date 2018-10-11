"use strict";
import {Container} from "typescript-ioc";
import {SexService} from "./Command/SexService";
import {Database} from "./Database";
import {Logger} from "./Logger";

export class DependencyConfigurator {
    public static configure() {
        Container.bind(Database);
        Container.get(Database);
        Container.bind(Logger);
        Container.get(Logger);
        Container.bind(SexService);
        Container.get(SexService);
    }
}
