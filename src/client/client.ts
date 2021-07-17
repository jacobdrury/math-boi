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
        await this.logManager.initialize(this);
        await initializeEvents(this);
        console.log('Client Initialized!');
    }

    set logManager(logManager: LogManager) {
        this._logManager = logManager;
    }

    get logManager(): LogManager {
        return this._logManager;
    }

    get commands(): Collection<string, BaseCommand> {
        return this._commands;
    }

    get events(): Collection<string, BaseEvent> {
        return this._events;
    }

    get prefix(): string {
        return this._prefix;
    }

    set prefix(prefix: string) {
        this._prefix = prefix;
    }
}
