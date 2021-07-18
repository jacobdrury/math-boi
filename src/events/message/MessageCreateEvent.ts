import BaseEvent from '../../utils/structures/BaseEvent';
import { Message } from 'discord.js';
import DiscordClient from '../../client/client';
import User from '../../database/models/User';
import { AccessLevel } from '../../utils/structures/AccessLevel';
import Member from '../../utils/structures/Member';

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

        const guildMember = message.member;
        let dbGuildMember = client.staffMembers.get(guildMember.id) ?? client.guildMembers.get(guildMember.id);

        // If user is not cached, check DB for user
        if (!dbGuildMember) {
            const search = await User.findOne({ inServer: true, discordId: guildMember.id });
            if (!search) {
                message.channel.send({
                    content: 'Something went wrong',
                    reply: {
                        messageReference: message,
                    },
                });
                return;
            }

            if (search.accessLevel >= AccessLevel.Staff) client.staffMembers.set(search.discordId, search);
            else client.guildMembers.set(search.discordId, search);

            dbGuildMember = search;
        }

        const member = new Member(guildMember, dbGuildMember);

        if (command.AccessLevel > member.accessLevel) {
            message.channel.send({
                content: 'You do not have permission to use this command',
                reply: {
                    messageReference: message,
                },
            });
            return;
        }

        command.run(client, message, cmdArgs);
    }
}
