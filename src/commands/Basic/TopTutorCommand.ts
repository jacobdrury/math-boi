import { Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';

export default class TopTutorCommand extends BaseCommand {
    constructor() {
        super('topTutor', 'Basic');
        this.description = 'Sends the top 20 tutor leader board';
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        // TODO
        message.channel.send('topTutor command works');
    }
}
