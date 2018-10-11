"use strict";
import {EntityRepository, Repository} from "typeorm";
import {AbstractCommand} from "../Commands/AbstractCommand";
import {CommandCalled} from "../Entity/CommandCalled";
import {User} from "../Entity/User";

@EntityRepository(CommandCalled)
export class CommandCalledRepository extends Repository<CommandCalled> {
    public async add(user: User, command: AbstractCommand) {
        let commandCalled = await this.createQueryBuilder("c")
            .where("user_id = :id", {id: user.id })
            .andWhere("command_name = :commandName", {commandName: command.name})
            .getOne();
        if (commandCalled == null) {
            commandCalled = new CommandCalled();
            commandCalled.user = user;
            commandCalled.commandName = command.name;
        }
        commandCalled.count = commandCalled.count + 1;
        commandCalled.lastestUse = new Date();

        return await this.save(commandCalled);
    }

    public async stats() {
        const commandCalled = await this.createQueryBuilder("c")
            .select("SUM(count)", "count")
            .addSelect("command_name")
            .groupBy("command_name")
            .orderBy("count", "DESC")
            .getRawMany();

        return commandCalled;
    }
}
