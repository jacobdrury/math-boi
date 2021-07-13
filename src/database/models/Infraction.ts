import { model, Schema, SchemaTypes } from 'mongoose';

export interface InfractionSchemaInterface {
    infractionId: string;
    userId: string;
    staffId: string;
    infractionType: InfractionType;
    date: Date;
    reason: String;
}

export enum InfractionType {
    Warn,
    Kick,
    Ban,
    Mute,
}

const InfractionSchema = new Schema({
    infractionId: {
        type: SchemaTypes.String,
        required: true,
    },
    userId: {
        type: SchemaTypes.String,
        required: true,
    },
    staffId: {
        type: SchemaTypes.String,
        required: true,
    },
    infractionType: {
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
