import { Message } from 'discord.js';
import DiscordClient from '../../client/client';
import { InfractionType } from '../../database/models/Infraction';
import { AccessLevel } from '../../utils/structures/AccessLevel';
import BaseModerationCommand from '../../utils/structures/BaseModerationCommand';

export default class WarnCommand extends BaseModerationCommand {
    constructor() {
        super('warn', 'Moderation', InfractionType.Warn, AccessLevel.Moderator);
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        await this.createInfraction(client, message, args);
    }
}
