import { ServerMessage } from '../../commonTypes';
import { getAppSettings } from '../../config';
import { getServerIpAddress } from '../../ip';
import { formatMilliseconds } from '../../utilities';
import * as valheimServer from '../valheimServer';

export const message: ServerMessage<'status'> = {
    prefix: 'status',
    execute: () => {
        const config = getAppSettings();
        return Promise.resolve({
            status: valheimServer.getStatus(),
            name: config.valheim.name,
            ip: `${getServerIpAddress()}:${config.valheim.port}`,
            password: config.valheim.password,
            connectedPlayers: valheimServer.getPlayers().map(p => { return { name: p.name, uptime: formatMilliseconds(p.stopwatch.read()) }; }),
            uptime: formatMilliseconds(valheimServer.getServerUptime()),
            activeUptime: formatMilliseconds(valheimServer.getServerActiveUptime())
        });
    }
};