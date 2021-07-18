import DiscordClient from '../../client/client';

export default abstract class BaseEvent {
    constructor(private name: string, public needsInitialization: boolean = false) {}

    getName(): string {
        return this.name;
    }

    async initialize(client: DiscordClient): Promise<void> {}
    abstract run(client: DiscordClient, ...args: any): void;
}
