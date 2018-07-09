"use strict";
import {Message} from "discord.js";
import * as request from "request";
import {AbstractCommand} from "./AbstractCommand";

export class Weather extends AbstractCommand {

    public static NAME: string = "weather";
    public static COND_THUN = {
        code: 200,
        emoji: "🌩️",
    };
    public static COND_DRIZ = {
        code: 300,
        emoji: "🌧️",
    };
    public static COND_RAIN = {
        code: 500,
        emoji: "🌧️",
    };
    public static COND_SNOW = {
        code: 600,
        emoji: "🌨️",
    };
    public static COND_ATMO = {
        code: 700,
        emoji: "⛅",
    };
    public static COND_CLEAR = {
        code: 800,
        emoji: "☀️",
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

    public do(message: Message) {
        const config = this.config;
        const logger = this.logger;
        const regexpWithCC = new RegExp("[^\\s]+\\s([\\w-\\s]+)\\s(\\w{2})$", "i");
        const regexpWithoutCC = new RegExp("[^\\s]+\\s([\\w-\\s]+)$", "i");
        const matchesWithCC = message.content.match(regexpWithCC);
        const matchesWithoutCC = message.content.match(regexpWithoutCC);
        let _ = null;
        let city = null;
        let countryCode = null;
        if (matchesWithCC && matchesWithCC.length === 3) {
            [_, city, countryCode] = matchesWithCC;
        } else if (matchesWithoutCC && matchesWithoutCC.length === 2) {
            [_, city] = matchesWithoutCC;
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
        this.url = this.url.replace(/%city%/, city);
        this.url = this.url.replace(/%unit%/, config.unit);
        this.url = this.url.replace(/%countryCode%/, countryCode);
        this.url = this.url.replace(/%token%/, config.token);
        this.info(`Fetching weather for city ${city} with country code '${countryCode}'`);
        request(this.url, (error, response, body) => {
            const jsonResponse = JSON.parse(body);
            if (jsonResponse.cod === "200") {
                logger.debug(`Weather for ${city} city was fetch.`);
                const list = jsonResponse.list;
                const result = [];
                for (const item of list) {
                    const date = item.dt_txt;
                    const [day, hour] = date.split(" "); // 2018-02-02 09:00:00
                    const hourMin = hour.split(":")[0] + "h";

                    const weatherId = item.weather[0].id;
                    if (!result[day]) {
                        result[day] = [];
                    }

                    switch (Math.floor(weatherId / 100)) {
                        case 2:
                            result[day].push({hourMin, value: Weather.COND_THUN.emoji});
                            break;
                        case 3:
                            result[day].push({hourMin, value: Weather.COND_DRIZ.emoji});
                            break;
                        case 5:
                            result[day].push({hourMin, value: Weather.COND_RAIN.emoji});
                            break;
                        case 6:
                            result[day].push({hourMin, value: Weather.COND_SNOW.emoji});
                            break;
                        case 7:
                            result[day].push({hourMin, value: Weather.COND_ATMO.emoji});
                            break;
                        case 8:
                            result[day].push({hourMin, value: Weather.COND_CLEAR.emoji});
                            break;
                    }
                }

                const embedFields = [];
                for (const day in result) {
                    let weatherValues = "";
                    for (const weather in result[day]) {
                        const weatherAll: any = result[day][weather];
                        weatherValues += " " + weatherAll.hourMin as string + " " + weatherAll.value as string;
                    }
                    embedFields.push({
                        name: day,
                        value: weatherValues,
                    });
                }
                const embed = {
                    embed: {
                        color: 3447003,
                        fields: embedFields,
                        timestamp: new Date(),
                        title: `${config.lang.title} - ${city} - ${countryCode}`,
                    },
                };
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
