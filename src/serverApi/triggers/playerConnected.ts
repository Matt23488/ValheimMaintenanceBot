import { ServerTrigger } from '../../commonTypes';
import * as valheimServer from '../valheimServer';
import * as wsServer from '../wsServer';

const prefix = 'Got character ZDOID from ';

export const trigger: ServerTrigger<'playerConnected'> = {
    parse: text => {
        if (text.indexOf(prefix) === -1) return { canHandle: false };
    
        const prefixIndex = text.indexOf(prefix);
        const firstColon = text.indexOf(':', prefixIndex + prefix.length);
        const secondColon = text.indexOf(':', firstColon + 1);
        const newPlayer = {
            id: text.slice(firstColon + 1, secondColon).trim(),
            name: text.slice(prefixIndex + prefix.length, firstColon).trim()
        };
    
        // Died
        if (newPlayer.id === '0') return { canHandle: false };
    
        // Respawned
        const existing = valheimServer.findPlayer(newPlayer.id);
        if (existing) return { canHandle: false };
    
        return { canHandle: true, data: newPlayer };
    },

    execute: data => {
        valheimServer.addPlayer(data.id, data.name);
        wsServer.sendMessage('playerConnected', data.name);
    }
};