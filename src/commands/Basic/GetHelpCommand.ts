import { Message, MessageOptions } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';

export default class GetHelpCommand extends BaseCommand {
    constructor() {
        super('getHelp', 'Basic');
        this.aliases = ['gh', 'gethelp'];
        this.description = 'Lets people know how to get help with questions in the server';
        this.usage = '<User>';
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        // TODO Update IDs
        const msgOptions: MessageOptions = {
            content: `To get help with a question please go to <#role selection> and add the subject you need help with.\n\nGo to the corresponding channel and post your question! Make sure you use the \`${client.prefix}tutor\` command so they can get notified of your question!`,
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
