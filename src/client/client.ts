import { Client, ClientOptions, Collection } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import BaseCommand from '../utils/structures/BaseCommand';
import LogManager from './LogManager';
import { initializeEvents } from '../utils/registry';

export default class DiscordClient extends Client {
    private _commands = new Collection<string, BaseCommand>();
    private _events = new Collection<string, BaseEvent>();
    private _logManager: LogManager;
    private _prefix: string = '!';

    constructor(options?: ClientOptions) {
        super(options);
    }

    async initialize() {
        await initializeEvents(this);
        this._logManager = new LogManager(this);
    }

    get commands(): Collection<string, BaseCommand> {
        return this._commands;
    }

    get events(): Collection<string, BaseEvent> {
        return this._events;
    }

    get logManager() {
        return this._logManager;
    }

    get prefix(): string {
        return this._prefix;
    }

    set prefix(prefix: string) {
        this._prefix = prefix;
    }
}
