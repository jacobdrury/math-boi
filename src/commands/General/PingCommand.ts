import { Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';

export default class PingCommand extends BaseCommand {
    constructor() {
        super('ping', 'General');
        this.description = 'Responds with Pong!';
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        message.channel.send('Pong!');
    }
}
