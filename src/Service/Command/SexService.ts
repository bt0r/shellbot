import axios from "axios";
import {Message, RichEmbed} from "discord.js";
import {Inject} from "typescript-ioc";
import {Boobs} from "../../Commands/Boobs";
import {Butts} from "../../Commands/Butts";
import {CommandCalledRepository} from "../../Repository/CommandCalledRepository";
import {Database} from "../Database";
import {Logger} from "../Logger";

/**
 * This service is used for Butts & Boobs commands
 */
export class SexService {
    @Inject
    private _database: Database;
    @Inject
    private _logger: Logger;
    private _boobsUrl: string = "http://api.oboobs.ru/boobs/1/1/random";
    private _buttsUrl: string = "http://api.obutts.ru/butts/1/1/random";

    private get database() { return this._database; }
    public get logger() { return this._logger; }
    public get boobsUrl() { return this._boobsUrl; }
    public get buttsUrl() { return this._buttsUrl; }

    public randomButts(callback) {
        return this.randomSex(Butts.NAME, this.buttsUrl, callback);
    }
    public randomBoobs(callback) {
        return this.randomSex(Boobs.NAME, this.boobsUrl, callback);
    }

    /**
     * Fetch a random sexy picture and return the response as a RichEmbed
     * @param type
     * @param url
     * @param callback
     */
    private randomSex(type: string, url: string, callback: any) {
        const typeStr = type === Boobs.NAME ? Boobs.NAME : Butts.NAME;

        axios.get(url).then(async (response) => {
            const pictureUrl = "http://media.o" + typeStr + ".ru/" + response.data[0].preview.replace(typeStr + "_preview", typeStr);
            this.logger.info(`[${typeStr}] New ${typeStr} found: ${pictureUrl}`);
            const richEmbed = new RichEmbed();
            richEmbed.setImage(pictureUrl);

            // Find statistics of butts/boobs commands
            const stats: any = await this.fetchStats();
            richEmbed.setFooter(`🍑 ${Butts.NAME} = ${stats.butts} | 🍈 ${Boobs.NAME} = ${stats.boobs} `);

            callback(richEmbed);
        });
    }

    public async fetchStats() {
        const commandCalledRepo = this.database.manager.getCustomRepository(CommandCalledRepository);
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
