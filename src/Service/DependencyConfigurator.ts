"use strict";
import {Container} from "typescript-ioc";
import {Database} from "./Database";
import {Logger} from "./Logger";

export class DependencyConfigurator {
    public static configure() {
        Container.bind(Database);
        Container.get(Database);
        Container.bind(Logger);
        Container.get(Logger);
    }
}
