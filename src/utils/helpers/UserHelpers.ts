import { GuildMember } from 'discord.js';
import Guilds from '../../database/models/Guild';
import Users, { UserSchemaInterface } from '../../database/models/User';

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