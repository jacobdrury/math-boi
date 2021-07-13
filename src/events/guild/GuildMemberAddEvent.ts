// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
import { GuildMember } from 'discord.js';
import BaseEvent from '../../utils/structures/BaseEvent';
import DiscordClient from '../../client/client';
import Users from '../../database/models/User';
import { CreateUser } from '../../utils/helpers/UserHelpers';

export default class GuildMemberAddEvent extends BaseEvent {
    constructor() {
        super('guildMemberAdd');
    }

    async run(client: DiscordClient, member: GuildMember) {
        try {
            const userDB = await Users.findOne({ discordId: member.id });
            if (!userDB) {
                await CreateUser(member);
            } else {
                await userDB.updateOne({ inServer: true });
            }
        } catch (err) {
            console.log(err);
        }
    }
}
