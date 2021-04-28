import { ServerTrigger } from '../../commonTypes';
import * as valheimServer from '../valheimServer';
import * as wsServer from '../wsServer';

const prefix = 'Destroying abandoned non persistent zdo ';

export const trigger: ServerTrigger<'playerDisconnected'> = {
    parse: text => {
        if (text.indexOf(prefix) === -1) return { canHandle: false };

        const prefixIndex = text.indexOf(prefix);
        const colon = text.indexOf(':', prefixIndex + prefix.length);
        const id = text.slice(prefixIndex + prefix.length, colon).trim();
        const player = valheimServer.findPlayer(id);
        if (!player) return { canHandle: false };

        return { canHandle: true, data: player };
    },

    execute: data => {
        valheimServer.removePlayer(data.id);
        wsServer.sendMessage('playerDisconnected', data.name);
    }
};