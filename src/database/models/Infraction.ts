import { model, Schema, SchemaTypes } from 'mongoose';

export interface InfractionSchemaInterface {
    id: string;
    userId: string;
    staffId: string;
    type: InfractionType;
    date: Date;
    reason: string;
}

export enum InfractionType {
    Warn,
    Kick,
    Ban,
    Mute,
}

const InfractionSchema = new Schema({
    id: {
        type: SchemaTypes.String,
        required: true,
        unique: true,
    },
    userId: {
        type: SchemaTypes.String,
        required: true,
    },
    staffId: {
        type: SchemaTypes.String,
        required: true,
    },
    type: {
        type: SchemaTypes.Number,
        required: true,
    },
    date: {
        type: SchemaTypes.Date,
        required: true,
    },
    reason: {
        type: SchemaTypes.String,
        required: true,
    },
});

export default model<InfractionSchemaInterface>('Infraction', InfractionSchema);
