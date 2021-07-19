import { Message, MessageOptions } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';

export default class RemindCommand extends BaseCommand {
    constructor() {
        super('remind', 'Basic');
        this.aliases = ['r'];
        this.description = 'Lets people know how to tag tutors when they as a question';
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        // TODO Update IDs
        const msgOptions: MessageOptions = {
            content: `Don’t forget to use \`${client.prefix}tutor\` the next time you post a question`,
        };

        if (message.reference)
            msgOptions.reply = {
                messageReference: message.reference.messageId,
            };
        else if (message.mentions.members.size > 0)
            msgOptions.content = `<@${message.mentions.members.first().id}> ${msgOptions.content}`;

        await message.channel.send(msgOptions);
        await message.delete();
    }
}
