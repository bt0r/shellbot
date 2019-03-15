import axios from "axios";
import {Message} from "discord.js";
import {AbstractCommand} from "../AbstractCommand";

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

    private _url: string = "http://api.openweathermap.org/data/2.5/forecast?q=%city%,%countryCode%&mode=json&appid=%token%&units=%units%";
    private _defaultUnit: string = "metric";
    private _defaultDateFormat: string = "fr-FR";

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

    public get defaultUnit(): string {
        return this._defaultUnit;
    }

    public get defaultDateFormat(): string {
        return this._defaultDateFormat;
    }

    public do(message: Message) {
        const config = this.config;
        const logger = this.logger;
        const regexpWithCC = new RegExp("[^\\s]+\\s([\\w-\\s]+)\\s(\\w{2})$", "i");
        const regexpWithoutCC = new RegExp("[^\\s]+\\s([\\w-\\s]+)$", "i");
        const matchesWithCC = message.content.match(regexpWithCC);
        const matchesWithoutCC = message.content.match(regexpWithoutCC);
        let _ = null;
        let city: string | null = null;
        let countryCode: any | null = null;
        const unit = config.unit ? config.unit : this.defaultUnit;
        let tempLabel: string | null = null;
        const dateFormat = config.datetime_format ? config.datetime_format : this.defaultDateFormat;
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
        switch (unit) {
            default:
                tempLabel = "°C";
                break;
            case "imperial":
                tempLabel = "°F";
                break;
            case "kelvin":
                tempLabel = "K";
                break;
        }
        this.url = this.url.replace(/%city%/, city);
        this.url = this.url.replace(/%unit%/, config.unit);
        this.url = this.url.replace(/%countryCode%/, countryCode);
        this.url = this.url.replace(/%token%/, config.token);
        this.url = this.url.replace(/%units%/, unit);
        this.info(`Fetching weather for city ${city} with country code '${countryCode}'`);
        axios.get(this.url).then((response) => {
            const jsonResponse = response.data;
            if (jsonResponse.cod === "200") {
                logger.debug(`Weather for ${city} city was fetch.`);
                const list = jsonResponse.list;
                const result: any = [];
                let daysFetched = 0;
                const isHour12 = dateFormat !== "fr-FR";
                for (const item of list) {
                    const date = new Date(item.dt_txt);
                    const temp = item.main.temp;
                    const humidity = item.main.humidity;
                    const dateOptions = {year: "numeric", month: "numeric", day: "numeric"};
                    const dayOptions = {hour: "numeric", minute: "numeric", hour12: isHour12};
                    const hour = new Intl.DateTimeFormat(dateFormat, dayOptions).format(date);
                    const day = new Intl.DateTimeFormat(dateFormat, dateOptions).format(date);

                    const weatherId = item.weather[0].id;
                    if (!result[day]) {
                        if (daysFetched > 2) {
                            break; // Only show 3 days
                        }
                        result[day] = [];
                        daysFetched++;
                    }
                    const weatherItem: WeatherItemInterface = new WeatherItem();

                    switch (Math.floor(weatherId / 100)) {
                        case 2:
                            weatherItem.value = Weather.COND_THUN.emoji;
                            break;
                        case 3:
                            weatherItem.value = Weather.COND_DRIZ.emoji;
                            break;
                        case 5:
                            weatherItem.value = Weather.COND_RAIN.emoji;
                            break;
                        case 6:
                            weatherItem.value = Weather.COND_SNOW.emoji;
                            break;
                        case 7:
                            weatherItem.value = Weather.COND_ATMO.emoji;
                            break;
                        case 8:
                            weatherItem.value = Weather.COND_CLEAR.emoji;
                            break;
                    }

                    result[day].push(weatherItem);
                }
                const embedFields = [];
                for (const day in result) {
                    if (typeof day === "string") {
                        let weatherValues = "";
                        for (const weather in result[day]) {
                            if (weather as any) {
                                const weatherAll: any = result[day][weather];
                                weatherValues += `${weatherAll.hour} ${weatherAll.value} 💧 ${weatherAll.humidity}% 🌡️ ${weatherAll.temp} ${tempLabel} \n`;
                            }
                        }
                        embedFields.push({
                            name: day,
                            value: weatherValues,
                        });
                    }
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
        }).catch((reason) => {
            message.reply(config.lang.not_found);
            logger.error(`The city ${city} was not found`);
        });
    }
}
