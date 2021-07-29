import { GuildMember, Message, MessageEmbed, Snowflake, TextChannel } from 'discord.js';
import DiscordClient from '../../client/client';
import { Colors } from '../../utils/helpers/Colors';
import { AccessLevel } from '../../utils/structures/AccessLevel';
import BaseModerationCommand from '../../utils/structures/BaseModerationCommand';
import TimeDifference from '../../utils/structures/TimeDifference';

export default class CleanCommand extends BaseModerationCommand {
    constructor() {
        super('clean', 'Moderation', AccessLevel.Moderator);
        this.description = 'Mass deletes messages from a channel.';
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        const channel = message.channel as TextChannel;
        const now = new Date();

        const embed: MessageEmbed = new MessageEmbed({
            color: Colors.Purple,
            author: {
                name: `Clean Command Executed`,
                icon_url: message.member.user.displayAvatarURL(),
            },
            fields: [
                { name: 'Moderator', value: `${message.member}`, inline: true },
                { name: 'Channel', value: `${message.channel}`, inline: true },
            ],
            timestamp: now,
        });

        let messagesToDelete: Array<Message> = [];
        if (message.mentions.members.size > 0) {
            await message.delete();
            const guildMember: GuildMember = message.mentions.members.first();
            const numToDelete: number = Number(args[1]);

            if (!(await this.isValidRange(message, numToDelete))) return;

            embed.addFields([
                { name: 'Messages Cleaned', value: `${numToDelete}`, inline: true },
                { name: 'Targeted User', value: `${guildMember}`, inline: true },
            ]);

            let lastMsg: Message = message;
            do {
                const msgs = await channel.messages.fetch({ limit: 100, before: lastMsg.id });

                lastMsg = msgs.last();

                messagesToDelete.push(
                    ...msgs
                        .array()
                        .filter(
                            (m) =>
                                m.author.id == guildMember.id &&
                                new TimeDifference(now, m.createdAt).daysDifference < 14
                        )
                        .slice(0, numToDelete - messagesToDelete.length)
                );
            } while (
                messagesToDelete.length != numToDelete &&
                new TimeDifference(now, lastMsg.createdAt).daysDifference < 14
            );
        } else {
            const numToDelete: number = Number(args[0]);
            if (!(await this.isValidRange(message, numToDelete))) return;

            const msgs = await channel.messages.fetch({ limit: numToDelete });
            messagesToDelete.push(
                ...msgs.filter((m) => new TimeDifference(now, m.createdAt).daysDifference < 14).values()
            );

            embed.addField('Messages Cleaned', `${numToDelete}`, true);
        }

        await channel.bulkDelete(messagesToDelete);

        await client.logManager.modLog.channel.send({ embeds: [embed] });
    }

    private async isValidRange(message: Message, numToDelete: number): Promise<boolean> {
        if (numToDelete < 1 || numToDelete > 100) {
            await message.reply('Please enter a ranger from [1-100]');
            return false;
        }
        return true;
    }
}
