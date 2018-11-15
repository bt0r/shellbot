import {TextChannel} from "discord.js";
import * as TwitterApi from "twitter";
import {AbstractSchedule} from "./AbstractSchedule";

enum TwitterSearchType {
    Account = "account",
    Tweet = "tweets",
}

export class Twitter extends AbstractSchedule {
    public static NAME: string = "twitter";
    private _twitterApi: TwitterApi;
    private readonly _queryType: string;
    private readonly _queryValues: string[];
    private _restrictionAllow: string = null;
    private _restrictionDeny: string = null;

    public constructor(args) {
        super();
        if (args.api_key !== undefined && args.api_secret_key !== undefined && args.access_token !== undefined && args.access_token_secret !== undefined) {
            this._twitterApi = new TwitterApi({
                consumer_key: args.api_key ,
                consumer_secret: args.api_secret_key,
                access_token_key: args.access_token,
                access_token_secret: args.access_token_secret,
            });
            if (args.query.type !== undefined && args.query.type !== null && args.query.values.length > 0) {
                this._queryType = args.query.type;
                this._queryValues = args.query.values;
            } else {
                this.error("TwitterSchedule config parameters are not correct, please RTFM.");
            }
        } else {
            this.error("There is one or more api_key missing with TwitterAPI, please RTFM.");
        }
    }

    public do(channel: TextChannel) {
        switch (this._queryType) {
            case TwitterSearchType.Account:
                this.lastTweets(channel);
                break;
            case TwitterSearchType.Tweet:

                break;
        }
    }

    public lastTweets(channel: TextChannel, max: number = 10) {
        for (const screenName of this._queryValues) {
            const params = { screen_name: screenName, count: max };
            this._twitterApi.get("statuses/user_timeline", params, (error, tweets, response) => {
                if (!error) {
                    for (const tweet of tweets) {
                        channel.send(tweet.text);
                    }
                } else {
                    this.error(error);
                }
            });
        }
    }

    public searchTweets(channel: TextChannel, max: number = 10) {
        /*
        this._twitterApi.get("search/tweets", {}, (error, tweets, response) => {
            if (!error) {
                for (const tweet of tweets.statuses) {
                    channel.send(tweet.text);
                }
            } else {
                console.log(error);
            }

        });*/
    }
    public renderEmbed(tweet: string, previewUrl: string, accountName: string, accountProfilePictureUrl: string) {

    }
}
