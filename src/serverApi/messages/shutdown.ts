import { ServerMessage } from '../../commonTypes';
import * as valheimServer from  '../valheimServer';
import * as wsServer from  '../wsServer';

export const message: ServerMessage<'shutdown'> = {
    prefix: 'shutdown',
    execute: async () => {
        await valheimServer.stop();
        wsServer.destroyWhenReady();
    }
};