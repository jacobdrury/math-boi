import BaseEvent from '../../utils/structures/BaseEvent';
import { GuildMember, Message, User, WebhookClient } from 'discord.js';
import DiscordClient from '../../client/client';
import Infraction, { InfractionSchemaInterface, InfractionType } from '../../database/models/Infraction';
import { generateUuid } from '../../utils/helpers/util';

export default class InfractionCreateEvent extends BaseEvent {
    private client: DiscordClient;

    constructor(client: DiscordClient) {
        super('infractionCreate', true);
    }

    async init(client: DiscordClient): Promise<void> {
        this.client = client;
    }

    async run(client: DiscordClient, staffMember: GuildMember, guildMember: GuildMember, reason: string, type: InfractionType) {
        const infraction = await Infraction.create({
            id: generateUuid(),
            userId: guildMember.user.id,
            staffId: staffMember.user.id,
            type,
            reason,
            date: new Date(),
        });

        switch (type) {
            case InfractionType.Kick:
                await guildMember.kick(`${reason} - ${staffMember.user.username}`);
                break;
            case InfractionType.Ban:
                await guildMember.ban({
                    reason: `${reason} - ${staffMember.user.username}`,
                });
                break;
            case InfractionType.Mute:
                break;
        }

        await this.DispatchModeratorLog(infraction, staffMember, guildMember);
    }

    private FormatType(type: InfractionType): String {
        switch (type) {
            case InfractionType.Warn:
                return 'Warn';
            case InfractionType.Kick:
                return 'Kick';
            case InfractionType.Ban:
                return 'Ban';
            case InfractionType.Mute:
                return 'Mute';
        }
    }

    private async DispatchModeratorLog(infraction: InfractionSchemaInterface, staffMember: GuildMember, guildMember: GuildMember) {
        const modLogChannel = this.client.logManager.modLog.channel;

        await modLogChannel.send({
            embeds: [
                {
                    color: this.GetColorFromType(infraction.type),
                    author: {
                        name: `[${this.FormatType(infraction.type).toUpperCase()}] ${guildMember.user.username}#${guildMember.user.discriminator}`,
                        iconURL: guildMember.user.avatarURL({
                            dynamic: true,
                        }),
                    },
                    description: `Infraction created for user <@${infraction.userId}> (${infraction.userId})`,
                    fields: [
                        {
                            name: 'Reason',
                            value: infraction.reason,
                            inline: true,
                        },
                        {
                            name: 'Staff Member',
                            value: `<@${staffMember.user.id}> (${staffMember.user.username}#${staffMember.user.discriminator})`,
                            inline: true,
                        },
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: `ID: ${infraction.id}`,
                    },
                },
            ],
        });
    }

    private GetColorFromType(type: InfractionType): number {
        switch (type) {
            case InfractionType.Warn:
                return 0xffa500;
            case InfractionType.Kick:
                return 0xb25afd;
            case InfractionType.Ban:
                return 0xff2c02;
            case InfractionType.Mute:
                return 0x2162ca;
        }
    }
}
