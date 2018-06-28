"use strict";
import * as cheerio from "cheerio";
import {Message, RichEmbed} from "discord.js";
import * as request from "request";
import {AbstractCommand} from "./AbstractCommand";

/**
 *  🔞 This command will show some randoms boobies using BonjourToutLeMonde 🔞
 *  Thanks to @CrazyMeal for his work
 */
export class Bonjour extends AbstractCommand {
    public static NAME: string = "bonjour";
    private _url: string = "http://www.bonjourtoutlemonde.com";
    private _choices = [
        {name: "Bonjour madame", by: "id", tag: "bonjour-madame"},
        {name: "Bonjour salope", by: "id", tag: "bonjour-salope"},
        {name: "Bonjour voisine", by: "id", tag: "bonjour-voisine"},
        {name: "Bonjour culotte", by: "id", tag: "bonjour-culotte"},
        {name: "Bonjour téton", by: "href", tag: "#bonjour-teton"},
        {name: "Bonjour fesse", by: "id", tag: "bonjour-fesse"},
        {name: "Bonjour l'asiat", by: "href", tag: "#bonjour-l-asiat"},
        {name: "Bonjour le cul", by: "href", tag: "#bonjour-le-cul"},
        {name: "Bonjour fétish", by: "id", tag: "bonjour-fetish"},
        {name: "Bonjour la grosse", by: "id", tag: "bonjour-la-grosse"},
        {name: "Bonjour latine", by: "id", tag: "bonjour-latine"},
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
            for (const choice of this.choices) {
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
        request(this.url, (error, response, body) => {
            if (response.statusCode === 200) {
                let $ = cheerio.load(body);
                const cheerioResult = $("a[" + selectedChoice.by + "=\"" + selectedChoice.tag + "\"]");

                if (cheerioResult && cheerioResult != null) {
                    $ = cheerio.load(cheerioResult.html());
                    const imageSrc = $("img").attr("src");

                    if (imageSrc && imageSrc !== "") {
                        command.info(`Fetching image: ${imageSrc}`);
                        const richEmbed = new RichEmbed();
                        richEmbed.setImage(imageSrc);
                        richEmbed.setTitle(selectedChoice.name);
                        message.channel.send(richEmbed).then(async (message2: Message) => {
                            await message2.react("👍");
                            await message2.react("👎");
                        });
                    }
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
}
