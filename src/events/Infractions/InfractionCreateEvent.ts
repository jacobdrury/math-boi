import BaseEvent from '../../utils/structures/BaseEvent';
import { GuildMember } from 'discord.js';
import DiscordClient from '../../client/client';
import Infraction, { InfractionSchemaInterface, InfractionType } from '../../database/models/Infraction';
import { FormatInfractionType, generateUuid, GetColorFromInfractionType } from '../../utils/helpers/util';
import { Colors } from '../../utils/helpers/Colors';

export default class InfractionCreateEvent extends BaseEvent {
    private client: DiscordClient;

    constructor(client: DiscordClient) {
        super('infractionCreate', true);
    }

    async initialize(client: DiscordClient): Promise<void> {
        this.client = client;
    }

    async run(
        client: DiscordClient,
        staffMember: GuildMember,
        guildMember: GuildMember,
        reason: string,
        type: InfractionType
    ) {
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
                console.log('Need to kick member');
                break;
                await guildMember.kick(`${reason} - ${staffMember.user.username}`);
                break;
            case InfractionType.Ban:
                console.log('Need to ban member');
                break;
                await guildMember.ban({
                    reason: `${reason} - ${staffMember.user.username}`,
                });
                break;
            case InfractionType.Mute:
                break;
        }

        await this.DispatchModeratorLog(infraction, staffMember, guildMember);
    }

    private async DispatchModeratorLog(
        infraction: InfractionSchemaInterface,
        staffMember: GuildMember,
        guildMember: GuildMember
    ) {
        const modLogChannel = this.client.logManager.modLog.channel;

        await modLogChannel.send({
            embeds: [
                {
                    color: GetColorFromInfractionType(infraction.type),
                    author: {
                        name: `[${FormatInfractionType(infraction.type).toUpperCase()}] ${guildMember.user.username}#${
                            guildMember.user.discriminator
                        }`,
                        iconURL: guildMember.user.avatarURL({
                            dynamic: true,
                        }),
                    },
                    description: `Infraction created for user <@${infraction.userId}> (${infraction.userId})`,
                    fields: [
                        {
                            name: 'Staff Member',
                            value: `${staffMember.user.username}#${staffMember.user.discriminator}`,
                            inline: false,
                        },
                        {
                            name: 'Reason',
                            value: infraction.reason,
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
}
