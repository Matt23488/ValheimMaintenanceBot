import { ServerTrigger } from '../../commonTypes';
import * as wsServer from '../wsServer';

const prefix = 'Random event set:';

export const trigger: ServerTrigger<'underAttack'> = {
    parse: text => {
        const prefixIndex = text.indexOf(prefix);
        if (prefixIndex === -1) return { canHandle: false };
    
        const data = text.slice(prefixIndex + prefix.length, text.indexOf('\n')).trim();
        wsServer.sendMessage('echo', `\`\`\`\nDEBUG\ntext: ${text}\nprefixIndex: ${prefixIndex}\ndata: ${data}\`\`\``);
        return { canHandle: true, data };
    },

    execute: data => {
        wsServer.sendMessage('underAttack', data);
    }
};