import {AbstractCommand}    from "./AbstractCommand";
import {Message, RichEmbed} from "discord.js";
import * as request         from "request";

export class Cat extends AbstractCommand {
    public static NAME: string = "cat";
    private _url: string       = "http://aws.random.cat/meow";

    constructor() {
        super();
        this.name = Cat.NAME;
    }

    public get url(): string {
        return this._url;
    }

    do(message: Message) {
        var command = this;
        command.info('Fetching new cat picture');
        let authorId     = message.author.id;
        let title        = `<@${authorId}>`;
        let waitingEmbed = new RichEmbed();
        waitingEmbed.setImage(this.config.loading_image);
        waitingEmbed.setTitle(this.config.lang.waiting);

        message.channel.send(title, waitingEmbed).then(message => {
            request(command.url, function (error, response, body) {
                if (response.statusCode == 200) {
                    let jsonResponse = JSON.parse(body);
                    if (jsonResponse.file) {
                        let url = jsonResponse.file;
                        command.info('New cat found (' + url + ')');
                        let richEmbed = new RichEmbed();
                        richEmbed.setImage(url);
                        message.edit(title, richEmbed);
                    }
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