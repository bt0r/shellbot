"use strict";
import {EntityRepository, Repository} from "typeorm";
import {Boobs} from "../Commands/Boobs";
import {Butts} from "../Commands/Butts";
import {CommandCalled} from "../Entity/CommandCalled";
import {CommandCalledRepository} from "./CommandCalledRepository";

@EntityRepository(CommandCalled)
export class SexRepository extends Repository<CommandCalled> {
    public async boobsVsButts() {
        const commandCalledRepo = this.manager.getCustomRepository(CommandCalledRepository);
        const stats = await commandCalledRepo.stats();

        let buttsCount = 0;
        let boobsCount = 0;
        stats.forEach((result: any) => {
            if (result.command_name === Butts.NAME) {
                buttsCount = result.count;
            }
            if (result.command_name === Boobs.NAME) {
                boobsCount = result.count;
            }
        });

        return {
            butts: buttsCount,
            boobs: boobsCount,
        };
    }
}
