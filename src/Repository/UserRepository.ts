import {EntityRepository, Repository} from "typeorm";
import {User} from "../Entity/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    public findOneByDiscordId(discordId: string) {
        return this.createQueryBuilder("u")
            .where("discordId = :discordId", {discordId})
            .getOne();
    }

    public async findOrCreate(newUser: User) {
        let user = await this.findOneByDiscordId(newUser.discordId);
        if (user == null) {
            user = new User();
            user.name = newUser.name;
            user.discordId = newUser.discordId;
            await this.save(user);
        }
        user.lastConnection = new Date();
        return user;
    }
}
