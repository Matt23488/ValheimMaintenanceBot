import * as roles from '../roles';
import { spawn } from 'child_process';
import path from 'path';
import { BotCommand } from '../../../commonTypes';

export const command: BotCommand = {
    name: 'npm',
    description: 'Execute npm commands.',
    role: roles.Admin,
    active: true,

    execute: (message, rest) => {
        return new Promise<void>(resolve => {
            let output = '';
            const npm = spawn('npm', [ rest ], { shell: true, cwd: path.join(__dirname, '../../../..') });
            npm.stdout.on('data', data => {
                output = output + '\n' + data.toString();
            });

            message.channel.startTyping();
            npm.on('close', (code, signal) => {
                message.channel.stopTyping();
                message.channel.send(`\`npm ${rest}\` output:\n\`\`\`${output}\`\`\``);
                resolve();
            });
        });
    }
};