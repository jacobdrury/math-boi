import {
    GuildMember,
    Message,
    Snowflake,
    TextChannel,
    UserResolvable,
} from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';
import Users from '../../database/models/User';
import { resolveMemberFromMessage } from '../../utils/helpers/GuildHelpers';
import { InfractionType } from '../../database/models/Infraction';
import { generateUuid } from '../../utils/helpers/util';
import { LogType } from '../../client/LogManager';

export default class PingCommand extends BaseCommand {
    constructor() {
        super('testtwo', 'test', []);
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        await client.logManager.messageLog.webhook.send('Hello');

        return;
        const staffMember = await message.guild.members.fetch(message.author);

        const [search, ...reason] = args;

        var guildMember = await resolveMemberFromMessage(message, search);

        if (guildMember == null) {
            message.channel.send({
                content:
                    'Please tag the user or provide their ID and try again',
                reply: {
                    messageReference: message,
                },
            });
            return;
        }

        client.emit(
            'infractionCreate',
            staffMember,
            guildMember,
            reason.join(' '),
            InfractionType.Warn
        );
    }
}
