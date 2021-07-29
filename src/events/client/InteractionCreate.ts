import BaseEvent from '../../utils/structures/BaseEvent';
import DiscordClient from '../../client/client';
import { Interaction } from 'discord.js';
import { GetMemberFromInteraction } from '../../utils/helpers/UserHelpers';

export default class InteractionCreateEvent extends BaseEvent {
    constructor() {
        super('interactionCreate');
    }

    async run(client: DiscordClient, interaction: Interaction) {
        if (interaction.isCommand()) {
            // await interaction.defer({ ephemeral: true }).catch(console.error);

            const command = client.commands.get(interaction.commandName);
            if (!command) {
                await interaction.reply({ content: 'An error has occurred', ephemeral: true });
                return;
            }

            const member = await GetMemberFromInteraction(client, interaction);

            if (command.accessLevel > member.accessLevel) {
                await interaction.reply({
                    content: 'You do not have permission to use this command',
                    ephemeral: true,
                });
                return;
            }

            const args = [];
            interaction.options.data.map((x) => args.push(x.value));

            command.runSlash(client, interaction, args);
        }
    }
}
