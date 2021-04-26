import Discord from 'discord.js';
import path from 'path';
import { spawn } from 'child_process';
import * as wsClient from '../../wsClient';
import { ServerStatusInfo } from '../../../utilities';

export const name = 'start';
export const description = 'Starts the Valheim server if it\'s not already running.';
export const role = null;
export const active = true;

export async function execute(message: Discord.Message, rest: string) {
    if (wsClient.isConnected()) {
        const serverInfo: ServerStatusInfo = await wsClient.sendRequest('status');
        message.channel.send(`The server is already running at \`${serverInfo.ip}\`.`);
        return;
    }

    if (rest === 'silent') wsClient.ignoreMessage('started');
    const dir = path.join(__dirname, '../../../..');
    spawn(path.join(dir, 'startserver.bat'), [], { cwd: dir, detached: true });

    if (rest !== 'silent') {
        wsClient.onConnected(onConnected);
        message.channel.startTyping();

        function onConnected() {
            message.channel.stopTyping();
            wsClient.offConnected(onConnected);
            require('./status').execute(message, '');
        }
    }
}