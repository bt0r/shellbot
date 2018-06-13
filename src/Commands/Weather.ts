"use strict";
import {AbstractCommand} from "./AbstractCommand";
import {Message}         from "discord.js";
import * as request      from "request";

export class Weather extends AbstractCommand {

    public static NAME: string = "weather";
    public static COND_THUN    = {
        code: 200,
        emoji: "🌩️"
    };
    public static COND_DRIZ    = {
        code: 300,
        emoji: "🌧️"
    };
    public static COND_RAIN    = {
        code: 500,
        emoji: "🌧️"
    };
    public static COND_SNOW    = {
        code: 600,
        emoji: "🌨️"
    };
    public static COND_ATMO    = {
        code: 700,
        emoji: "⛅"
    };
    public static COND_CLEAR   = {
        code: 800,
        emoji: "☀️"
    };

    private _url: string = "http://api.openweathermap.org/data/2.5/forecast?q=%city%,%countryCode%&mode=json&appid=%token%&units=%unit%";


    constructor() {
        super();
        this.name = Weather.NAME;
    }

    public get url(): string {
        return this._url;
    }

    public set url(url: string) {
        this._url = url;
    }

    do(message: Message) {
        let config           = this.config;
        let logger           = this.logger;
        let regexpWithCC     = new RegExp("[^\\s]+\\s([\\w-\\s]+)\\s(\\w{2})$", "i");
        let regexpWithoutCC  = new RegExp("[^\\s]+\\s([\\w-\\s]+)$", "i");
        let matchesWithCC    = message.content.match(regexpWithCC);
        let matchesWithoutCC = message.content.match(regexpWithoutCC);

        if (matchesWithCC && matchesWithCC.length === 3) {
            var [_, city, countryCode] = matchesWithCC;
        } else if (matchesWithoutCC && matchesWithoutCC.length === 2) {
            var [_, city] = matchesWithoutCC;
        } else {
            message.reply(config.lang.city_missing);
            return;
        }
        if (!countryCode && !config.default_country_code) {
            message.reply(config.lang.country_code_missing);
        } else if (!countryCode && config.default_country_code) {
            countryCode = config.default_country_code;
        }
        if (!config.unit) {
            message.reply(config.lang.unit_missing);
            return;
        }
        this.url = this.url.replace(/\%city\%/, city);
        this.url = this.url.replace(/\%unit\%/, config.unit);
        this.url = this.url.replace(/\%countryCode\%/, countryCode);
        this.url = this.url.replace(/\%token\%/, config.token);
        this.info(`Fetching weather for city ${city} with country code '${countryCode}'`);
        request(this.url, function (error, response, body) {
            let jsonResponse = JSON.parse(body);
            if (jsonResponse.cod == "200") {
                logger.debug(`Weather for ${city} city was fetch.`);
                let list   = jsonResponse.list;
                let result = [];
                for (let i = 0; i < list.length; i++) {
                    let date        = list[i].dt_txt;
                    let [day, hour] = date.split(" "); // 2018-02-02 09:00:00
                    hour            = hour.split(':')[0] + "h";

                    let weatherId = list[i].weather[0].id;
                    if (!result[day]) {
                        result[day] = [];
                    }

                    switch (Math.floor(weatherId / 100)) {
                        case 2:
                            result[day].push({hour: hour, value: Weather.COND_THUN.emoji});
                            break;
                        case 3:
                            result[day].push({hour: hour, value: Weather.COND_DRIZ.emoji});
                            break;
                        case 5:
                            result[day].push({hour: hour, value: Weather.COND_RAIN.emoji});
                            break;
                        case 6:
                            result[day].push({hour: hour, value: Weather.COND_SNOW.emoji});
                            break;
                        case 7:
                            result[day].push({hour: hour, value: Weather.COND_ATMO.emoji});
                            break;
                        case 8:
                            result[day].push({hour: hour, value: Weather.COND_CLEAR.emoji});
                            break;
                    }

                }
                let embedFields = [];
                for (let day in result) {
                    let weatherValues = "";
                    for (let weather in result[day]) {
                        weather = result[day][weather];
                        weatherValues += " " + weather.hour + " " + weather.value;
                    }
                    embedFields.push({
                        name: day,
                        value: weatherValues
                    });
                }
                ;
                let embed = {
                    embed: {
                        color: 3447003,
                        title: `${config.lang.title} - ${city} - ${countryCode}`,
                        fields: embedFields,
                        timestamp: new Date(),
                    }
                }
                //console.log(embedFields);
                message.channel.send(embed);
            } else if (jsonResponse.cod === "404") {
                message.reply(config.lang.not_found);
                logger.error(`The city ${city} was not found`);

            } else {
                message.reply(config.lang.error);
                logger.error(`An error occured, please create an issue on the shellbot github repository`);
            }
        });
    }
}