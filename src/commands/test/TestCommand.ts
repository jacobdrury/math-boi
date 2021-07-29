import { Message } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';

export default class PingCommand extends BaseCommand {
    constructor() {
        super('test', 'test');
        this.description = 'This is the test command.';
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        // const guildMembers = (await message.guild.members.fetch()).filter((u) => !u.user.bot);

        // for await (const [id, gm] of guildMembers) {
        //     await (
        //         await User.create({
        //             guildId: gm.guild.id,
        //             discordId: gm.id,
        //             username: gm.user.username,
        //             inServer: true,
        //         })
        //     ).save();
        // }

        // console.log('All users added to database');

        await message.reply('hi');
    }
}
