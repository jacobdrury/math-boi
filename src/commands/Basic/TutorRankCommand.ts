import { Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';

export default class TutorRankCommand extends BaseCommand {
    constructor() {
        super('tutorRank', 'Basic');
        this.aliases = ['trank'];
        this.description = 'Sends the rank of the tutor';
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        message.channel.send('tutorRank command works');
    }
}
