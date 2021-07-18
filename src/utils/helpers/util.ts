import { v4 as uuidv4 } from 'uuid';
import { InfractionType } from '../../database/models/Infraction';
import { Colors } from './Colors';

export const generateUuid = (): string => {
    return uuidv4();
};

export const FormatInfractionType = (type: InfractionType, pastTense = false): String => {
    switch (type) {
        case InfractionType.Warn:
            return pastTense ? 'Warned' : 'Warn';
        case InfractionType.Kick:
            return pastTense ? 'Kicked' : 'Kick';
        case InfractionType.Ban:
            return pastTense ? 'Banned' : 'Ban';
        case InfractionType.Mute:
            return pastTense ? 'Muted' : 'Mute';
    }
};

export const GetColorFromInfractionType = (type: InfractionType): number => {
    switch (type) {
        case InfractionType.Warn:
            return Colors.Orange;
        case InfractionType.Kick:
            return Colors.Purple;
        case InfractionType.Ban:
            return Colors.Red;
        case InfractionType.Mute:
            return Colors.Blue;
    }
};
