import path from 'path';
import { spawn } from 'child_process';
import * as wsClient from '../../wsClient';
import { BotCommand } from '../../../commonTypes';
import * as status from './status';

export const command: BotCommand = {
    name: 'start',
    description: 'Starts the Valheim server if it\'s not already running.',
    role: null,
    active: true,

    execute: async (message, rest) => {
        if (wsClient.isConnected()) {
            status.command.execute(message, '');
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
                status.command.execute(message, '');
            }
        }
    }
};