import { Snowflake, TextChannel, WebhookClient } from 'discord.js';
import LogConfig, {
    LogConfigSchemaInterface,
} from '../database/models/LogConfig';
import DiscordClient from './client';

export default class LogManager {
    private _messageLog: Log;
    private _userLog: Log;
    private _joinLeaveLog: Log;
    private _modLog: Log;
    private _botLog: Log;
    private _client: DiscordClient;

    constructor(client: DiscordClient) {
        this._client = client;
        this._messageLog = new Log(client, LogType.message);
        this._userLog = new Log(client, LogType.user);
        this._joinLeaveLog = new Log(client, LogType.joinleave);
        this._modLog = new Log(client, LogType.mod);
        this._botLog = new Log(client, LogType.bot);
    }

    refreshLog(logType: LogType) {
        switch (logType) {
            case LogType.message:
                this._messageLog = new Log(this._client, LogType.message);
                break;
            case LogType.user:
                this._userLog = new Log(this._client, LogType.user);
                break;
            case LogType.joinleave:
                this._messageLog = new Log(this._client, LogType.joinleave);
                break;
            case LogType.mod:
                this._userLog = new Log(this._client, LogType.mod);
                break;
            case LogType.bot:
                this._userLog = new Log(this._client, LogType.bot);
                break;
        }
    }

    async initLogChannel(logType: LogType, channel: TextChannel) {
        const { id: WebhookId, token: WebhookToken } =
            await channel.createWebhook(this._client.user.username, {
                avatar: this._client.user.displayAvatarURL(),
            });

        const logConfig = await LogConfig.create({
            guildId: channel.guildId,
            logType,
            channelId: channel.id,
            WebhookId,
            WebhookToken,
        });

        await logConfig.save();

        this.refreshLog(logType);
    }

    get messageLog() {
        return this._messageLog;
    }

    get userLog() {
        return this._userLog;
    }

    get joinLeaveLog() {
        return this._joinLeaveLog;
    }

    get modLog() {
        return this._modLog;
    }

    get botLog() {
        return this._botLog;
    }
}

class Log {
    guildId: string;
    logType: LogType;
    channel: TextChannel;
    webhook: WebhookClient;

    constructor(client: DiscordClient, logType: LogType) {
        (async () => {
            const config = await this.loadLogConfig(logType);

            if (!config) return;

            const guild = await client.guilds.fetch(
                config.guildId as Snowflake
            );

            this.channel = (await guild.channels.fetch(
                config.channelId as Snowflake
            )) as TextChannel;

            this.guildId = guild.id;
            this.logType = config.logType;

            this.webhook = new WebhookClient(
                config.WebhookId as Snowflake,
                config.WebhookToken
            );
        })();
    }

    private loadLogConfig = async (
        logType: LogType
    ): Promise<LogConfigSchemaInterface> => {
        let results = await LogConfig.findOne({
            logType,
        });

        return results ?? null;
    };
}

export enum LogType {
    message = 'MESSAGE',
    user = 'USER',
    joinleave = 'JOINLEAVE',
    mod = 'MOD',
    bot = 'BOT',
}
