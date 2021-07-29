import { CommandInteraction, GuildMember, Interaction, Message, Snowflake, User } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';
import { GetMemberFromInteraction } from '../../utils/helpers/UserHelpers';

export default class AvatarCommand extends BaseCommand {
    constructor() {
        super('avatar', 'Basic');
        this.aliases = ['icon', 'pfp', 'av'];
        this.description = 'Get the avatar URL of the tagged user, or your own avatar.';
        this.usage = '<User>';
        this.options = [
            {
                name: 'user',
                type: 'USER',
                description: 'User to get profile picture from',
                required: false,
            },
        ];
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        if (!message.mentions.users.size) {
            message.channel.send({
                embeds: [
                    {
                        title: `Your avatar avatar:`,
                        image: {
                            url: `${message.author.displayAvatarURL({
                                dynamic: true,
                            })}`,
                        },
                    },
                ],
            });
            return;
        }

        const user = message.mentions.users.first();

        message.channel.send({
            embeds: [
                {
                    title: `${user.username}'s avatar:`,
                    image: {
                        url: `${user.displayAvatarURL({ dynamic: true })}`,
                    },
                },
            ],
        });
    }

    async runSlash(client: DiscordClient, interaction: CommandInteraction, args: Array<string> | null) {
        const [user] = args;

        if (!user) {
            await interaction.reply({
                embeds: [
                    {
                        title: `Your avatar avatar:`,
                        image: {
                            url: `${(interaction.member.user as User).displayAvatarURL({
                                dynamic: true,
                            })}`,
                        },
                    },
                ],
            });
            return;
        }

        const member = await interaction.guild.members.fetch(user as Snowflake);

        await interaction.reply({
            embeds: [
                {
                    title: `${member.user.username}'s avatar:`,
                    image: {
                        url: `${member.user.displayAvatarURL({ dynamic: true })}`,
                    },
                },
            ],
        });
    }
}
