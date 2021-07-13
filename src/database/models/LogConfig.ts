import { model, Schema, SchemaTypes } from 'mongoose';
import { LogType } from '../../client/LogManager';

export interface LogConfigSchemaInterface {
    guildId: string;
    logType: LogType;
    channelId: string;
    WebhookId: string;
    WebhookToken: string;
}

const LogConfigSchema = new Schema({
    guildId: {
        type: SchemaTypes.String,
        required: true,
    },
    logType: {
        type: SchemaTypes.String,
        required: true,
        unique: true,
    },
    channelId: {
        type: SchemaTypes.String,
        required: true,
    },
    WebhookId: {
        type: SchemaTypes.String,
        required: true,
    },
    WebhookToken: {
        type: SchemaTypes.String,
        required: true,
    },
});

export default model<LogConfigSchemaInterface>('LogConfig', LogConfigSchema);
