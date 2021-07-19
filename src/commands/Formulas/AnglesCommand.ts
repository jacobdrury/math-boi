import { Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';

export default class AnglesCommand extends BaseCommand {
    constructor() {
        super('angles', 'Formulas');
        this.description = 'Send the angles formulas';
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        message.channel.send(
            'https://cdn.discordapp.com/attachments/725174867867205703/766349857987493958/screen-shot-2019-02-07-at-4.png'
        );
    }
}
