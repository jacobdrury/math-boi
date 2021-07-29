import { CommandInteraction, GuildMember, Message } from 'discord.js';
import DiscordClient from '../../client/client';
import Guilds from '../../database/models/Guild';
import User from '../../database/models/User';
import Users, { UserSchemaInterface } from '../../database/models/User';
import { AccessLevel } from '../structures/AccessLevel';
import Member from '../structures/Member';

export const CreateUser = async (guildMember: GuildMember, modifiers = null) => {
    let guild = await Guilds.findOne({ guildId: guildMember.guild.id });

    if (!guild) {
        guild = await Guilds.create({
            guildId: guildMember.guild.id,
            name: guildMember.guild.name,
        });
    }

    return await Users.create({
        discordId: guildMember.id,
        username: guildMember.user.username,
        guild,
        ...modifiers,
    });
};

export const GetMemberFromMessage = async (client: DiscordClient, message: Message): Promise<Member> => {
    const guildMember = message.member;
    let dbGuildMember = client.staffMembers.get(guildMember.id) ?? client.guildMembers.get(guildMember.id);

    // If user is not cached, check DB for user
    if (!dbGuildMember) {
        const search = await User.findOne({ inServer: true, discordId: guildMember.id });
        if (!search) {
            message.channel.send({
                content: 'Something went wrong',
                reply: {
                    messageReference: message,
                },
            });
            return;
        }

        if (search.accessLevel >= AccessLevel.Staff) client.staffMembers.set(search.discordId, search);
        else client.guildMembers.set(search.discordId, search);

        dbGuildMember = search;
    }

    return new Member(guildMember, dbGuildMember);
};

export const GetMemberFromInteraction = async (
    client: DiscordClient,
    interaction: CommandInteraction
): Promise<Member> => {
    const guildMember = interaction.member as GuildMember;
    let dbGuildMember = client.staffMembers.get(guildMember.id) ?? client.guildMembers.get(guildMember.id);

    // If user is not cached, check DB for user
    if (!dbGuildMember) {
        const search = await User.findOne({ inServer: true, discordId: guildMember.id });
        if (!search) {
            await interaction.followUp('Something went wrong');
            return;
        }

        if (search.accessLevel >= AccessLevel.Staff) client.staffMembers.set(search.discordId, search);
        else client.guildMembers.set(search.discordId, search);

        dbGuildMember = search;
    }

    return new Member(guildMember, dbGuildMember);
};
