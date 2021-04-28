import { getAppSettings } from '../../../config';
import { BotCommand, ServerStatuses } from '../../../commonTypes';
import * as wsClient from '../../wsClient';
import * as roles from '../roles';
import * as status from './status';

export const command: BotCommand = {
    name: 'stop',
    description: 'Saves and shuts down the Valheim server if it\'s running.',
    role: roles.Admin,
    active: true,

    execute: async (message, rest) => {
        const config = getAppSettings();
        if (!wsClient.isConnected()) {
            message.channel.send(`The server is not running. Use \`${config.discord.commandPrefix}start\` to start the server.`);
            return;
        }

        const statusInfo = await wsClient.sendRequest('status');
        if (statusInfo!.status === ServerStatuses.stopped) {
            message.channel.send(`The server is not running. Use \`${config.discord.commandPrefix}start\` to start the server.`);
            return;
        }
        message.channel.send('Stopping server...');
        await wsClient.sendRequest('shutdown');
        setTimeout(() => status.command.execute(message, ''), 1000);
    }
};