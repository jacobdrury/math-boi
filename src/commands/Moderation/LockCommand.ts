import { Collection, Message, Snowflake, TextChannel } from 'discord.js';
import DiscordClient from '../../client/client';
import BaseModerationCommand from '../../utils/structures/BaseModerationCommand';
import { AccessLevel } from '../../utils/structures/AccessLevel';
import { Colors } from '../../utils/helpers/Colors';

export default class LockCommand extends BaseModerationCommand {
    private lockMsgIds = new Map();
    constructor() {
        super('lock', 'Moderation', AccessLevel.Moderator);
        this.description = 'Locks/Unlocks all channels in the server';
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        const channels = await message.guild.channels.fetch();
        // .filter((c) => /*!message.client.ids.opt.ignoredCategories.includes(c.parentID) && */ c.type == 'text');

        if (args[0] == 'on') await this.lock(message, channels as Collection<Snowflake, TextChannel>);
        else if (args[0] == 'off') await this.unlock(message, channels as Collection<Snowflake, TextChannel>);
    }

    private lock = async (message: Message, channels: Collection<Snowflake, TextChannel>) => {
        this.lockMsgIds.clear();

        // TODO
        const announcementC = null; //message.guild.channels.cache.get(message.client.ids.opt.channels.announcement);

        for (const [id, channel] of channels) {
            // await Promise.all([
            //     channel.permissionOverwrites.get(message.guild.id).update({
            //         SEND_MESSAGES: false,
            //     }),
            //     channel.setName(`${channel.name}🔒`),
            //     channel
            //         .send(`🔒 Channel locked please check ${announcementC || 'the announcements'} for more info 🔒`)
            //         .then((msg) => this.lockMsgIds.set(channel.id, `${msg.id}`))
            //         .catch(console.error),
            // ]);
        }

        if (announcementC) {
            await announcementC.send({
                embeds: [
                    {
                        color: Colors.Red,
                        title: '🔒 Server Locked 🔒',
                        description: `The server has been locked by ${message.author}\nPlease be patient while our team resolves the issue!`,
                    },
                ],
            });
        }

        return message.channel.send('All channels have been locked 🔒');
    };

    private unlock = async (message: Message, channels: Collection<Snowflake, TextChannel>) => {
        for (const [id, channel] of channels) {
            // await Promise.all([
            //     channel.permissionOverwrites.get(message.guild.id).update({
            //         SEND_MESSAGES: null,
            //     }),
            //     channel.setName(channel.name.replace('🔒', '')),
            //     channel.messages
            //         .fetch(this.lockMsgIds.get(channel.id))
            //         .then((msg) => msg.delete())
            //         .catch(console.error),
            // ]);
        }

        // TODO
        const announcementC = null; // message.guild.channels.cache.get(message.client.ids.opt.channels.announcement);

        if (announcementC) {
            await announcementC.send({
                embeds: [
                    {
                        color: Colors.Green,
                        title: '🔓 Server Unlocked 🔓',
                        description: `The server has been unlocked! Thank you for your patience!`,
                    },
                ],
            });
        }

        return message.channel.send('All channels have been unlocked 🔓');
    };
}
