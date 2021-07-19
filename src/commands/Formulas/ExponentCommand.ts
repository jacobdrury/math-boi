import { Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';

export default class ExponentCommand extends BaseCommand {
    constructor() {
        super('exponent', 'Formulas');
        this.aliases = ['exponents', 'exp'];
        this.description = 'Sends exponent formulas';
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        message.channel.send('https://cdn.discordapp.com/attachments/725174817841610813/738569271482777720/ari121.png');
    }
}
