import { registerCommands, registerEvents } from './utils/registry';
import config from '../slappey.json';
import DiscordClient from './client/client';
import { connectDatabase } from './database/Mongoose';
import { Intents } from 'discord.js';
import LogManager from './client/LogManager';

const flags = Intents.FLAGS;
const intents = new Intents().add(
    flags.GUILDS,
    flags.GUILD_MEMBERS,
    flags.GUILD_BANS,
    flags.GUILD_EMOJIS,
    flags.GUILD_INTEGRATIONS,
    flags.GUILD_WEBHOOKS,
    flags.GUILD_INVITES,
    flags.GUILD_VOICE_STATES,
    flags.GUILD_PRESENCES,
    flags.GUILD_MESSAGES,
    flags.GUILD_MESSAGE_REACTIONS,
    flags.GUILD_MESSAGE_TYPING,
    flags.DIRECT_MESSAGES,
    flags.GUILD_MESSAGE_REACTIONS,
    flags.GUILD_MESSAGE_TYPING
);

const client = new DiscordClient({
    partials: ['MESSAGE', 'REACTION'],
    intents,
});

(async () => {
    client.prefix = config.prefix || client.prefix;
    client.logManager = new LogManager();

    await registerCommands(client, '../commands');
    await registerEvents(client, '../events');

    await connectDatabase(config.MONGO_URI);

    await client.login(config.token);
})();
