import { model, Schema, SchemaTypes } from 'mongoose';

export interface UserSchemaInterface {
    guildId: string;
    discordId: string;
    username: string;
    inServer: boolean;
}

const UserSchema = new Schema({
    discordId: {
        type: SchemaTypes.String,
        required: true,
        unique: true,
    },
    guild: {
        type: SchemaTypes.String,
        required: true,
    },
    username: SchemaTypes.String,
    inServer: {
        type: SchemaTypes.Boolean,
        default: true,
    },
});

export default model<UserSchemaInterface>('User', UserSchema);
