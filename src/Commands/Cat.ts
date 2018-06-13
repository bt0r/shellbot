import {AbstractCommand}    from "./AbstractCommand";
import {Message, RichEmbed} from "discord.js";
import * as request         from "request";

export class Cat extends AbstractCommand {
    public static NAME: string = "cat";
    private _url: string       = "http://thecatapi.com/api/images/get?format=src&results_per_page=1&api_key=";

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

    do(message: Message) {
        if (!this.config.token) {
            this.error("Token is missing, please add one on your config");
            return;
        }
        this.url    = this.url + this.config.token;
        var command = this;
        command.info('Fetching new cat picture');
        let authorId     = message.author.id;
        let title        = `<@${authorId}>`;
        let waitingEmbed = new RichEmbed();
        waitingEmbed.setImage(this.config.loading_image);
        waitingEmbed.setTitle(this.config.lang.waiting);

        message.channel.send(waitingEmbed).then(message => {
            request(command.url, function (error, response, body) {
                if (response.statusCode == 200) {
                    let url = response.request.href;
                    command.info('New cat found (' + url + ')');
                    let richEmbed = new RichEmbed();
                    richEmbed.setImage(url);
                    message.edit(title, richEmbed);
                } else {
                    message.edit(command.config.lang.error).then(message => {
                        setTimeout(function () {
                            message.delete();
                        }, 10000);
                    });
                }
            });
        }).catch(message => {
            message.edit(command.config.lang.error).then(message => {
                setTimeout(function () {
                    message.delete();
                }, 10000);
            });
        })
    }
}