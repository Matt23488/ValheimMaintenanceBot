import Discord from 'discord.js';
import { getAppSettings } from '../../../config';
import { ServerStatuses, ServerStatusInfo } from '../../../utilities';
import * as wsClient from '../../wsClient';
import * as roles from '../roles';

export const name = 'stop';
export const description = 'Saves and shuts down the Valheim server if it\'s running.';
export const role = roles.Admin;
export const active = true;

export async function execute(message: Discord.Message, rest: string) {
    const config = getAppSettings();
    if (!wsClient.isConnected()) {
        message.channel.send(`The server is not running. Use \`${config.discord.commandPrefix}start\` to start the server.`);
        return;
    }

    const statusInfo: ServerStatusInfo = await wsClient.sendRequest('status');
    if (statusInfo.status === ServerStatuses.stopped) {
        message.channel.send(`The server is not running. Use \`${config.discord.commandPrefix}start\` to start the server.`);
        return;
    }
    message.channel.send('Stopping server...');
    await wsClient.sendRequest('shutdown');
    setTimeout(() => require('./status').execute(message, ''), 1000);
}