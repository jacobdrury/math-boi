import { GuildMember } from 'discord.js';
import { model, Schema, SchemaTypes } from 'mongoose';

export interface UserSchemaInterface {
    username: string;
    discordId: string;
    inServer: boolean;
}

const UserSchema = new Schema({
    username: SchemaTypes.String,
    discordId: {
        type: SchemaTypes.String,
        required: true,
    },
    inServer: {
        type: SchemaTypes.Boolean,
        default: true,
    },
});

export default model<UserSchemaInterface>('User', UserSchema);
