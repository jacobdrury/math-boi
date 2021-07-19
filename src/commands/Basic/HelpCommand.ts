import { Collection, Message, MessageEmbed } from 'discord.js';
import BaseCommand from '../../utils/structures/BaseCommand';
import DiscordClient from '../../client/client';
import { Colors } from '../../utils/helpers/Colors';
import { loadCommands } from '../../utils/registry';
import { GetMemberFromMessage } from '../../utils/helpers/UserHelpers';
import Member from '../../utils/structures/Member';

export default class HelpCommand extends BaseCommand {
    constructor() {
        super('help', 'Basic');
        this.aliases = ['commands'];
    }

    async run(client: DiscordClient, message: Message, args: Array<string>) {
        const helpEmbed = new MessageEmbed().setColor(Colors.Blue);
        const member = await GetMemberFromMessage(client, message);

        const filter = (c: BaseCommand) => member.accessLevel >= c.accessLevel && c.name != 'help';

        if (args.length) await this.getCMD(client, message, args, helpEmbed, client.commands.filter(filter));
        else await this.getAll(client, message, member, helpEmbed);
    }

    private async getCMD(
        client: DiscordClient,
        message: Message,
        args: Array<string>,
        helpEmbed: MessageEmbed,
        commands: Collection<string, BaseCommand>
    ) {
        const name = args[0];
        const command = commands.get(name);

        if (!command) {
            return message.reply(`Could not find command: ${name}`);
        }

        helpEmbed.setTitle('Command Info').addField('**Command Name:**', command.name, !(command.aliases == null));
        if (command.aliases.length) helpEmbed.addField('**Aliases:**', command.aliases.join(', '), true);
        if (command.description.length) helpEmbed.addField('**Description:**', command.description);
        if (command.usage.length) helpEmbed.addField('**Usage:**', `${client.prefix}${command.name} ${command.usage}`);
        await message.reply({ embeds: [helpEmbed] });
    }

    private async getAll(client: DiscordClient, message: Message, member: Member, helpEmbed: MessageEmbed) {
        const categories = new Collection<string, Collection<string, BaseCommand>>();
        await loadCommands(client, '../commands', (command: BaseCommand) => {
            if (command.accessLevel > member.accessLevel || command.name == 'help') return;

            const category = categories.get(command.category);
            if (!category)
                categories.set(command.category, new Collection<string, BaseCommand>([[command.name, command]]));
            else category.set(command.name, command);
        });

        for (const [name, commands] of categories) {
            const commandNames = commands.map((command: BaseCommand, name: string) => `\`${name}\``).join(' ');
            helpEmbed.addField(name, commandNames);
        }

        helpEmbed
            .setTitle("Here's a list of all my commands!")
            .setFooter(`You can send \`${client.prefix}help [command name]\` to get info on a specific command!`);

        await message.reply({ embeds: [helpEmbed] });
    }
}
