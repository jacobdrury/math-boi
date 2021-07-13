// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberRemove
import { GuildMember } from 'discord.js';
import BaseEvent from '../../utils/structures/BaseEvent';
import DiscordClient from '../../client/client';
import Users from '../../database/models/User';
import { CreateUser } from '../../utils/helpers/UserHelpers';

export default class GuildMemberRemoveEvent extends BaseEvent {
    constructor() {
        super('guildMemberRemove');
    }

    async run(client: DiscordClient, member: GuildMember) {
        try {
            const user = await Users.findOneAndUpdate(
                { discordId: member.id },
                { inServer: false, username: member.user.username }
            );

            if (!user) {
                await CreateUser(member, { inServer: false });
            }
        } catch (err) {
            console.log(err);
        }
    }
}
