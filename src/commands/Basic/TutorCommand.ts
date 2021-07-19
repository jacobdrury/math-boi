import { Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';

export default class TutorCommand extends BaseCommand {
    constructor() {
        super('tutor', 'basic');
        this.description = 'Tags the tutors and posts your question';
        this.aliases = ['t'];
        this.usage = 'Your question';
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        // TODO
        message.channel.send('tutor command works');
    }
}
