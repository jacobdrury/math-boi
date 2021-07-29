import { Message } from 'discord.js';
import DiscordClient from '../../client/client';
import { AccessLevel } from '../../utils/structures/AccessLevel';
import { InfractionType } from '../../database/models/Infraction';
import BaseModerationCommand from '../../utils/structures/BaseModerationCommand';

export default class MassBanCommand extends BaseModerationCommand {
    constructor() {
        super('massBan', 'Moderation', AccessLevel.Moderator, InfractionType.Ban);
        this.description = 'Bans a user from the server';
        this.usage = '<User>';
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        await this.createInfraction(client, message, args);
    }
}
