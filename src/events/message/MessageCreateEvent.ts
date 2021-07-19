import BaseEvent from '../../utils/structures/BaseEvent';
import { Message } from 'discord.js';
import DiscordClient from '../../client/client';
import User from '../../database/models/User';
import { AccessLevel } from '../../utils/structures/AccessLevel';
import Member from '../../utils/structures/Member';
import { GetMemberFromMessage } from '../../utils/helpers/UserHelpers';

export default class MessageEvent extends BaseEvent {
    constructor() {
        super('messageCreate');
    }

    async run(client: DiscordClient, message: Message) {
        if (message.author.bot) return;
        if (!message.content.startsWith(client.prefix)) return;

        const [cmdName, ...cmdArgs] = message.content.slice(client.prefix.length).trim().split(/\s+/);
        const command = client.commands.get(cmdName);

        if (!command) return;

        const member = await GetMemberFromMessage(client, message);

        if (command.accessLevel > member.accessLevel) {
            message.reply({
                content: 'You do not have permission to use this command',
            });
            return;
        }

        command.run(client, message, cmdArgs);
    }
}
