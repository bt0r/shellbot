"use strict";
import axios, {AxiosResponse} from "axios";
import * as cheerio from "cheerio";
import {Message, RichEmbed} from "discord.js";
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
            axios.get(command.url).then((response: AxiosResponse) => {
                if (response.status === 200) {
                    const url = response.request.res.responseUrl;
                    command.info(`New cat found (${url})`);
                    const richEmbed = new RichEmbed();
                    richEmbed.setFooter("By thecatapi.com");
                    richEmbed.setImage(url);
                    message2.edit(title, richEmbed);
                } else {
                    axios.get(command.url2).then((response2) => {
                        const $ = cheerio.load(response2.data);
                        if (response2.status === 200) {
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
