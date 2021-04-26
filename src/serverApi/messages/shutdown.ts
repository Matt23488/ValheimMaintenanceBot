import * as valheimServer from  '../valheimServer';
import * as wsServer from  '../wsServer';

export const prefix = 'shutdown';
export async function execute(data: string) {
    await valheimServer.stop();
    wsServer.destroyWhenReady();
}