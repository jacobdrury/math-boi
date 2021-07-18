import { GuildMember, Message } from 'discord.js';
import DiscordClient from '../../client/client';
import { InfractionType } from '../../database/models/Infraction';
import { Colors } from '../../utils/helpers/Colors';
import { resolveMemberFromMessage } from '../helpers/GuildHelpers';
import { FormatInfractionType, GetColorFromInfractionType } from '../helpers/util';
import { AccessLevel } from './AccessLevel';
import BaseCommand from './BaseCommand';

export default abstract class BaseModerationCommand extends BaseCommand {
    constructor(
        name: string,
        category: string,
        private type: InfractionType,
        accessLevel: AccessLevel = AccessLevel.Staff
    ) {
        super(name, category, [], accessLevel);
    }

    async createInfraction(client: DiscordClient, message: Message, args: Array<String>) {
        const staffMember = await message.guild.members.fetch(message.author);

        const [search, ...reasonRaw] = args;
        const reason = reasonRaw.join(' ');

        if (reason.length > 1024) {
            message.channel.send({
                content: 'Reason must be less than 1024 characters, please try again',
                reply: {
                    messageReference: message,
                },
            });
            return;
        }

        var guildMember = await resolveMemberFromMessage(message, search);

        if (guildMember == null) {
            message.channel.send({
                content: 'Please tag the user or provide their ID and try again',
                reply: {
                    messageReference: message,
                },
            });
            return;
        }

        client.emit('infractionCreate', staffMember, guildMember, reason, this.type);

        await Promise.all([
            this.sendConfirmation(message, guildMember, staffMember, reason),
            this.sendDMConfirmation(guildMember, staffMember, reason),
        ]);
    }

    async sendConfirmation(message: Message, guildMember: GuildMember, staffMember: GuildMember, reason: string) {
        await message.channel.send({
            embeds: [
                {
                    color: Colors.Green,
                    author: {
                        name: `[${FormatInfractionType(this.type).toUpperCase()}] ${guildMember.user.username}#${
                            guildMember.user.discriminator
                        }`,
                        iconURL: guildMember.user.avatarURL({
                            dynamic: true,
                        }),
                    },
                    description: `<@${guildMember.id}> (${guildMember.id}) has been ${FormatInfractionType(
                        this.type,
                        true
                    )}!`,
                    fields: [
                        {
                            name: 'Staff Member',
                            value: `${staffMember.user.username}#${staffMember.user.discriminator}`,
                            inline: true,
                        },
                        {
                            name: 'Reason',
                            value: reason,
                            inline: false,
                        },
                    ],
                    timestamp: new Date(),
                },
            ],
            reply: {
                messageReference: message,
            },
        });
    }

    async sendDMConfirmation(guildMember: GuildMember, staffMember: GuildMember, reason: string) {
        guildMember
            .send({
                embeds: [
                    {
                        color: GetColorFromInfractionType(this.type),
                        author: {
                            name: `[${FormatInfractionType(this.type).toUpperCase()}] ${guildMember.user.username}#${
                                guildMember.user.discriminator
                            }`,
                            iconURL: guildMember.user.avatarURL({
                                dynamic: true,
                            }),
                        },
                        description: `You have been ${FormatInfractionType(this.type, true)}!`,
                        fields: [
                            {
                                name: 'Staff Member',
                                value: `${staffMember.user.username}#${staffMember.user.discriminator}`,
                                inline: true,
                            },
                            {
                                name: 'Reason',
                                value: reason,
                                inline: false,
                            },
                        ],
                        timestamp: new Date(),
                    },
                ],
            })
            .catch((ex: Error) => {
                if (ex.name == 'DiscordAPIError' && ex.message == 'Cannot send messages to this user') return;
                throw ex;
            });
    }
}
