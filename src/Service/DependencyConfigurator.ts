import {Container} from "typescript-ioc";
import {Listener} from "../Listener/Listener";
import {SexService} from "./Command/SexService";
import {Config} from "./Config";
import {Database} from "./Database";
import {Logger} from "./Logger";
import {ShellbotClient} from "./ShellbotClient";
import {StatusService} from "./StatusService";

export class DependencyConfigurator {
    public static configure() {
        Container.bind(Logger);
        Container.get(Logger);
        Container.bind(Database);
        Container.get(Database);
        Container.bind(ShellbotClient);
        Container.get(ShellbotClient);
        Container.bind(Listener);
        Container.get(Listener);
        Container.bind(StatusService);
        Container.get(StatusService);
        Container.bind(SexService);
        Container.get(SexService);
    }

    public static configureCommand() {
        Container.bind(Logger);
        Container.get(Logger);
        Container.bind(Config);
        Container.get(Config);
        Container.bind(Database);
        Container.get(Database);
    }
}
