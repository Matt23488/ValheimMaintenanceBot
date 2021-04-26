import { getAppSettings } from '../../config';
import { getServerIpAddress } from '../../ip';
import { formatMilliseconds, ServerStatusInfo } from '../../utilities';
import * as valheimServer from '../valheimServer';

export const prefix = 'status';
export function execute(data: string): Promise<ServerStatusInfo> {
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