import { GuildMember } from 'discord.js';
import Users, { UserSchemaInterface } from '../../database/models/Users';

export const CreateUser = async (
    guildMember: GuildMember,
    modifiers = null
) => {
    return await Users.create({
        discordId: guildMember.id,
        username: guildMember.user.username,
        ...modifiers,
    });
};
