"use strict";
import {DependencyConfigurator} from "./src/Service/DependencyConfigurator";
import {ShellbotClient} from "./src/ShellbotClient";

DependencyConfigurator.configure();
new ShellbotClient();
