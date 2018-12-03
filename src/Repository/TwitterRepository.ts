import {EntityRepository, Repository} from "typeorm";
import {Twitter} from "../Entity/Twitter";

@EntityRepository(Twitter)
export class TwitterRepository extends Repository<Twitter> {
    public isTweetExists(twitterId: string, channel: string) {
        return this.createQueryBuilder("t")
            .where("twitter_id = :twitterId", {twitterId})
            .andWhere("channel = :channel", {channel})
            .getOne();
    }

    public async getLastTweetId(username: string, channel: string) {
      const result = await this.createQueryBuilder("t")
          .select("MAX(twitter_id) as last_tweet_id")
          .where("channel = :channel", {channel})
          .getRawOne();
      return result.last_tweet_id;
    }
}
