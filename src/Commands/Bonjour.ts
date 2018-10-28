"use strict";
import axios from "axios";
import * as cheerio from "cheerio";
import {Message, RichEmbed} from "discord.js";
import {AbstractCommand} from "./AbstractCommand";

/**
 *  🔞 This command will show some randoms boobies using BonjourToutLeMonde 🔞
 *  Thanks to @CrazyMeal for his work
 */
export class Bonjour extends AbstractCommand {
    public static NAME: string = "bonjour";
    private _url: string = "http://www.bonjourtoutlemonde.com";
    private _choices = [
        {name: "Bonjour madame", url: "1-bonjour-madame.html"},
        {name: "Bonjour salope", url: "2-bonjour-salope.html"},
        {name: "Bonjour voisine", url: "3-bonjour-voisine.html"},
        {name: "Bonjour culotte", url: "5-bonjour-culotte.html"},
        {name: "Bonjour téton", url: "20-bonjour-teton.html"},
        {name: "Bonjour fesse", url: "40-bonjour-fesse.html"},
        {name: "Bonjour l'asiat", url: "46-bonjour-l-asiat.html"},
        {name: "Bonjour le cul", url: "47-bonjour-le-cul.html"},
        {name: "Bonjour fétish", url: "85-bonjour-fetish.html"},
        {name: "Bonjour la grosse", url: "89-bonjour-la-grosse.html"},
        {name: "Bonjour latine", url: "90-bonjour-latine.html"},
        {name: "Bonjour geexy", url: "53-geexy.html"},
        {name: "Bonjour jailbait", url: "99-bonjour-jailbait.html"},
        {name: "Bonjour demoiselle", url: "135-daily-demoiselle.html"},
    ];

    constructor() {
        super();
        this.name = "bonjour";
    }

    public do(message: Message) {
        this.info("Fetching new bonjour picture");
        const command = this;

        const [commandName, choiceAsked] = message.content.split(" ");
        let selectedChoice = null;
        if (choiceAsked) {
            for (const choiceId in this.choices) {
                const choice = this.choices[choiceId];
                if (choice.name.toLowerCase().includes(choiceAsked.toLowerCase())) {
                    selectedChoice = choice;
                    break;
                }
            }
        }
        if (!selectedChoice) {
            const randomChoicePosition: number = Math.floor(Math.random() * this.choices.length);
            selectedChoice = this.choices[randomChoicePosition];
            this.info(`Selected random position ${randomChoicePosition} and it gives: name=${selectedChoice.name} | tag=${selectedChoice.tag}`);
        }

        const urlToScrap = this.url + "/" + this.getTodayDate() + "/" + selectedChoice.url;
        this.debug("Will try to scrap this url > " + urlToScrap);

        axios.get(urlToScrap).then((response) => {
            command.debug("Status code is > " + response.status);

            if (response.status === 200) {
                try {
                    const $ = cheerio.load(response.data);
                    const imageSrc = $("#single-image").attr("src");

                    command.debug("Obtained image > " + imageSrc);

                    if (imageSrc) {
                        const richEmbed = new RichEmbed();
                        richEmbed.setImage(imageSrc);
                        richEmbed.setTitle(selectedChoice.name);
                        message.channel.send(richEmbed).then(async (message2: Message) => {
                            await message2.react("👍");
                            await message2.react("👎");
                        });
                    }
                } catch (e) {
                    command.error(e);
                    const errorMessage = "Cannot fetch Bonjour picture, please contact an admin or make a pull request on github";
                    message.reply(errorMessage);
                }
            } else {
                const errorMessage = "Cannot fetch Bonjour picture, please contact an admin or make a pull request on github";
                command.error(errorMessage);
                message.reply(errorMessage);
            }
        });
    }

    /**
     * Return URL of Bonjour tout le monde website
     * @returns {string}
     */
    public get url() {
        return this._url;
    }

    public get choices() {
        return this._choices;
    }

    private getTodayDate() {
        const todayDate = new Date();
        let day;
        let month;
        const todayDay = todayDate.getDate();
        if (todayDay < 10) {
            day = "0" + todayDay;
        } else {
            day = todayDay.toString();
        }

        const todayMonth = todayDate.getMonth() + 1;
        if (todayMonth < 10) {
            month = "0" + todayMonth;
        } else {
            month = todayMonth.toString();
        }

        const year = todayDate.getFullYear();

        return day + "-" + month + "-" + year;
    }
}
