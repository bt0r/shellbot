"use strict";
import * as cheerio from "cheerio";
import {Message, RichEmbed} from "discord.js";
import * as request from "request";
import {AbstractCommand} from "./AbstractCommand";

export class Cat extends AbstractCommand {
    public static NAME: string = "cat";
    private _url: string = "http://thecatapi.com/api/images/get?format=src&results_per_page=1&api_key=";
    private _url2: string = "http://random.cat";

    constructor() {
        super();
        this.name = Cat.NAME;
    }

    public get url(): string {
        return this._url;
    }

    public set url(url: string) {
        this._url = url;
    }

    public get url2(): string {
        return this._url2;
    }

    public set url2(url2: string) {
        this._url2 = url2;
    }

    public do(message: Message) {
        if (!this.config.token) {
            this.error("Token is missing, please add one on your config");
            return;
        }
        this.url = this.url + this.config.token;
        const command = this;
        command.info("Fetching new cat picture");
        const authorId = message.author.id;
        const title = `<@${authorId}>`;
        const waitingEmbed = new RichEmbed();
        waitingEmbed.setImage(this.config.loading_image);
        waitingEmbed.setTitle(this.config.lang.waiting);

        message.channel.send(waitingEmbed).then((message2: Message) => {
            request(command.url, (error, response) => {
                if (response.statusCode === 200) {
                    const url = response.request.href;
                    command.info(`New cat found (${url})`);
                    const richEmbed = new RichEmbed();
                    richEmbed.setFooter("By thecatapi.com");
                    richEmbed.setImage(url);
                    message2.edit(title, richEmbed);
                } else {
                    request(command.url2, (error2, response2, body2) => {
                        const $ = cheerio.load(body2);
                        if (response2.statusCode === 200) {
                            const url = $("#cat").prop("src");
                            command.info(`New cat found (${url})`);
                            const richEmbed = new RichEmbed();
                            richEmbed.setFooter("By random.cat");
                            richEmbed.setImage(url);
                            message2.edit(title, richEmbed);
                        } else {
                            message2.edit(command.config.lang.error).then((message3: Message) => {
                                setTimeout(() => {
                                    message3.delete();
                                }, 10000);
                            });
                        }
                    });
                }
            });

        }).catch((message2: Message) => {
            message2.edit(command.config.lang.error).then((message3: Message) => {
                setTimeout(() => {
                    message3.delete();
                }, 10000);
            });
        });
    }
}
