import BaseEvent from '../../utils/structures/BaseEvent';
import { Message } from 'discord.js';
import DiscordClient from '../../client/client';
import { GetMemberFromMessage } from '../../utils/helpers/UserHelpers';

export default class MessageEvent extends BaseEvent {
    constructor() {
        super('messageCreate');
    }

    async run(client: DiscordClient, message: Message) {
        if (message.author.bot) return;
        if (!message.content.startsWith(client.prefix)) return;

        const [rawName, ...cmdArgs] = message.content.slice(client.prefix.length).trim().split(/\s+/);
        const cmdName = rawName.toLowerCase();

        const command = client.commands.get(cmdName) ?? client.aliases.get(cmdName);

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
