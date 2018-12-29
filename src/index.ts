import {DependencyConfigurator} from "./Service/DependencyConfigurator";
import {ShellbotClient} from "./ShellbotClient";

DependencyConfigurator.configure();
new ShellbotClient();
