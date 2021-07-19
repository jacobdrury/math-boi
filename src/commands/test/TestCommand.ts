import { GuildMember, Message, Snowflake, TextChannel, UserResolvable } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';
import Users from '../../database/models/User';
import { resolveMemberFromMessage } from '../../utils/helpers/GuildHelpers';
import Infraction, { InfractionType } from '../../database/models/Infraction';
import { generateUuid } from '../../utils/helpers/util';
import { LogType } from '../../client/LogManager';
import BaseModerationCommand from '../../utils/structures/BaseModerationCommand';
import User from '../../database/models/User';
import { AccessLevel } from '../../utils/structures/AccessLevel';

export default class PingCommand extends BaseCommand {
    constructor() {
        super('test', 'test');
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        // const guildMembers = (await message.guild.members.fetch()).filter((u) => !u.user.bot);

        // for await (const [id, gm] of guildMembers) {
        //     await (
        //         await User.create({
        //             guildId: gm.guild.id,
        //             discordId: gm.id,
        //             username: gm.user.username,
        //             inServer: true,
        //         })
        //     ).save();
        // }

        // console.log('All users added to database');

        await message.reply('hi');
    }
}
