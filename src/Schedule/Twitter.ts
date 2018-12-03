import {RichEmbed, TextChannel} from "discord.js";
import * as TwitterApi from "twitter";
import {Twitter as TwitterVO} from "../Entity/Twitter";
import {TwitterRepository} from "../Repository/TwitterRepository";
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
        this.name = Twitter.NAME;
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

    public async lastTweets(channel: TextChannel, max: number = 10) {
        const twitterRepository = this.database.manager.getCustomRepository(TwitterRepository);

        for (const screenName of this._queryValues) {
            const lastTweetId = await twitterRepository.getLastTweetId(screenName, channel.name);
            const params: any = {
                screen_name: screenName,
                count: max,
            };
            if (lastTweetId !== null && lastTweetId !== undefined) {
                params.since_id = lastTweetId;
            }
            this._twitterApi.get("statuses/user_timeline", params, async (error, tweets) => {
                if (!error) {
                    this.info(`${tweets.length} fetched`);
                    for (const tweet of tweets) {
                        const twitterVO = new TwitterVO();
                        twitterVO.twitterId = tweet.id_str;
                        twitterVO.channel = channel.name;
                        twitterVO.username = screenName;

                        const tweetExists = await twitterRepository.isTweetExists(twitterVO.twitterId, twitterVO.channel);
                        if (tweetExists != null) {
                            this.info(`Tweet ${tweet.id_str} already exists in database.`);
                            continue;
                        }
                        const tweetEmbed = this.renderEmbed(tweet);
                        channel.send(tweetEmbed).then(() => {
                            this.database.manager.save(twitterVO).then(() => {
                                this.info(`Tweet ${tweet.id_str} added in database.`);
                            });
                        }).catch((reason) => {
                            this.error(`Cannot fetch or send tweet: ${reason}`);
                        });
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
    public renderEmbed(tweet: any) {
        const tweetUrl = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
        const tweetEmbed = new RichEmbed();
        tweetEmbed.setAuthor(tweet.user.name, tweet.user.profile_image_url, tweetUrl);
        tweetEmbed.setColor(3447003);
        tweetEmbed.setDescription(tweet.text);
        tweetEmbed.setFooter(`${tweet.favorite_count} ❤️ ${tweet.retweet_count} 🔁`);
        tweetEmbed.setTimestamp(tweet.created_at);

        return tweetEmbed;
    }
}
