import {EntityRepository, Repository} from "typeorm";
import {User} from "../Entity/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    public findOneByDiscordId(discordId: string) {
        return this.createQueryBuilder("u")
            .where("discord_id = :discordId", {discordId})
            .getOne();
    }

    public async findOrCreate(newUser: User) {
        let user = await this.findOneByDiscordId(newUser.discordId);
        if (user == null) {
            user = new User();
            user.discordId = newUser.discordId;
            user.name = newUser.name;
            await this.save(user);
        }
        user.name = newUser.name;
        user.lastConnection = new Date();
        return user;
    }
}
