import { Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';

export default class TrigCommand extends BaseCommand {
    constructor() {
        super('trig', 'Formulas');
        this.description = 'Sends the trig identities';
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        message.channel.send('https://cdn.discordapp.com/attachments/725174934665429024/731589189748916234/image0.png');
    }
}
