import { Message } from 'discord.js';
import DiscordClient from '../../client/client';
import { AccessLevel } from './AccessLevel';

export default abstract class BaseCommand {
    _accessLevel: AccessLevel;
    constructor(private name: string, private category: string, private aliases: Array<string> = [], accessLevel: AccessLevel = AccessLevel.Base) {
        this._accessLevel = accessLevel;
    }

    get AccessLevel(): AccessLevel {
        return this._accessLevel;
    }

    getName(): string {
        return this.name;
    }

    getCategory(): string {
        return this.category;
    }

    getAliases(): Array<string> {
        return this.aliases;
    }

    abstract run(client: DiscordClient, message: Message, args: Array<string> | null): Promise<void>;
}
