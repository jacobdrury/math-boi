import { Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';

export default class PollCommand extends BaseCommand {
    constructor() {
        super('poll', 'Basic');
        this.description = 'Starts a poll';
        this.usage = 'What is your favorite food? |Sushi|Mexican|Chinese';
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        const emojis = ['0⃣', '1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];

        const [question, ...pollItems] = args.join(' ').split(/\s?\|\s?/);

        if (!question) {
            message.reply('Empty question detected! You do not need a | right after poll.');
            return;
        }

        if (pollItems.length > 10) {
            await message.reply(`Your input: \`${message.content}\`\nYou can only pass up to 10 items`);
            return;
        }

        let contents = '';
        for (let i = 0; i < pollItems.length; i++) {
            contents += `${emojis[i]} - \`${pollItems[i]}\`\n`;
        }

        const embed = {
            author: {
                name: message.author.username,
                icon_url: message.author.avatarURL({ dynamic: true }),
            },
            title: `\`${question}\``,
            description: contents,
            color: 0xfdb515,
        };

        // const msg =
        //     message.channel.id == message.client.ids.opt.channels.qotd
        //         ? `<@&${message.client.ids.opt.roles.qotd}>`
        //         : '';

        const sentPoll = await message.channel.send({ embeds: [embed] });
        for (let i = 0; i < pollItems.length; i++) {
            await sentPoll.react(`${emojis[i]}`);
        }

        await message.delete();
    }
}
