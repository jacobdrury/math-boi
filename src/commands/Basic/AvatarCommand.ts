import { CommandInteraction, GuildMember, Interaction, Message, User } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';

export default class AvatarCommand extends BaseCommand {
    constructor() {
        super('avatar', 'Basic');
        this.aliases = ['icon', 'pfp', 'av'];
        this.description = 'Get the avatar URL of the tagged user(s), or your own avatar.';
        this.usage = '<User>';
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

        message.mentions.users.forEach((user) => {
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
        });
    }

    async runSlash(client: DiscordClient, interaction: CommandInteraction, args: Array<string> | null) {
        await interaction.followUp({
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
    }
}
