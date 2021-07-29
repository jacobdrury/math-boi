import { Client, ClientOptions, Collection } from 'discord.js';
import BaseEvent from '../utils/structures/BaseEvent';
import BaseCommand from '../utils/structures/BaseCommand';
import LogManager from './LogManager';
import { initializeEvents, registerSlashCommands } from '../utils/registry';
import User, { UserSchemaInterface } from '../database/models/User';
import { AccessLevel } from '../utils/structures/AccessLevel';
import { CronJob } from 'cron';

export default class DiscordClient extends Client {
    private _commands = new Collection<string, BaseCommand>();
    private _aliases = new Collection<string, BaseCommand>();
    private _events = new Collection<string, BaseEvent>();
    private _staffMembers = new Collection<string, UserSchemaInterface>();
    private _guildMembers = new Collection<string, UserSchemaInterface>();
    private _logManager: LogManager;
    private _prefix: string = '!';

    constructor(options?: ClientOptions) {
        super(options);
    }

    async initialize() {
        await Promise.all([
            this.logManager.initialize(this),
            this.loadStaffMembers(),
            this.loadGuildMembers(),
            initializeEvents(this),
            registerSlashCommands(this, '../commands'),
        ]);

        console.log('Client Initialized!');

        // Refresh Local Cache every hour
        const refreshStaffCache = new CronJob('0 * * * *', this.loadStaffMembers);
        const refreshGuildMembers = new CronJob('0 * * * *', this.loadGuildMembers);

        refreshStaffCache.start();
        refreshGuildMembers.start();
    }

    async loadStaffMembers() {
        this._staffMembers = new Collection<string, UserSchemaInterface>();
        const staff = await User.find({
            inServer: true,
            accessLevel: { $gte: AccessLevel.Staff },
        });

        staff.forEach((u) => this._staffMembers.set(u.discordId, u));
        // console.log('Staff Members Loaded!');
    }

    async loadGuildMembers() {
        this._guildMembers = new Collection<string, UserSchemaInterface>();
        const members = await User.find({
            inServer: true,
            accessLevel: { $lt: AccessLevel.Staff },
        });

        members.forEach((u) => this._guildMembers.set(u.discordId, u));
        // console.log('Guild Members Loaded!');
    }

    set logManager(logManager: LogManager) {
        this._logManager = logManager;
    }

    get logManager(): LogManager {
        return this._logManager;
    }

    get staffMembers(): Collection<string, UserSchemaInterface> {
        return this._staffMembers;
    }

    get guildMembers(): Collection<string, UserSchemaInterface> {
        return this._guildMembers;
    }

    get commands(): Collection<string, BaseCommand> {
        return this._commands;
    }

    get aliases(): Collection<string, BaseCommand> {
        return this._aliases;
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
