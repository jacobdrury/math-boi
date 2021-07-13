import BaseEvent from '../../utils/structures/BaseEvent';
import { GuildMember, Message, User, WebhookClient } from 'discord.js';
import DiscordClient from '../../client/client';
import Infraction, {
    InfractionSchemaInterface,
    InfractionType,
} from '../../database/models/Infraction';
import { generateUuid } from '../../utils/helpers/util';

export default class InfractionCreateEvent extends BaseEvent {
    private ModeratorLogChannel: WebhookClient;

    constructor(client: DiscordClient) {
        super('infractionCreate');
    }

    async run(
        client: DiscordClient,
        staffMember: GuildMember,
        guildMember: GuildMember,
        reason: string,
        infractionType: InfractionType
    ) {
        const infraction = await Infraction.create({
            infractionId: generateUuid(),
            userId: guildMember.user.id,
            staffId: staffMember,
            infractionType,
            reason,
        });

        switch (infractionType) {
            case InfractionType.Kick:
                await guildMember.kick(
                    `${reason} - ${staffMember.user.username}`
                );
                break;
            case InfractionType.Ban:
                await guildMember.ban({
                    reason: `${reason} - ${staffMember.user.username}`,
                });
                break;
            case InfractionType.Mute:
                break;
        }

        await this.DispatchModeratorLog(infraction);
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

    private async DispatchModeratorLog(infraction: InfractionSchemaInterface) {}
}
