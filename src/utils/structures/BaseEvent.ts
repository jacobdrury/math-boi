import DiscordClient from '../../client/client';

export default abstract class BaseEvent {
    constructor(private _name: string, private _needsInitialization: boolean = false) {}

    get name(): string {
        return this._name;
    }

    get needsInitialization(): boolean {
        return this._needsInitialization;
    }

    async initialize(client: DiscordClient): Promise<void> {}
    abstract run(client: DiscordClient, ...args: any): void;
}
