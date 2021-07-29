import BaseEvent from '../../utils/structures/BaseEvent';
import DiscordClient from '../../client/client';
import { Interaction } from 'discord.js';

export default class InteractionCreateEvent extends BaseEvent {
    constructor() {
        super('interactionCreate');
    }

    async run(client: DiscordClient, interaction: Interaction) {
        if (interaction.isCommand()) {
            await interaction.defer().catch(console.error);

            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) {
                await interaction.followUp({ content: 'An error has occurred', ephemeral: true });
                return;
            }

            const args = [];
            interaction.options.data.map((x) => args.push(x.value));

            cmd.runSlash(client, interaction, args);
        }
    }
}
