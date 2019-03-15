import {User as DiscordUser} from "discord.js";
import {User} from "./User";

export class UserFactory {
    public static create(object: any) {
        let user: User|null = null;
        if (object instanceof DiscordUser) {
            user = this.createFromDiscordUser(object);
        }

        return user;
    }

    public static createFromDiscordUser(discordUser: DiscordUser) {
            const user = new User();
            user.discordId = discordUser.id;
            user.name = discordUser.username;
            return user;
    }
}
