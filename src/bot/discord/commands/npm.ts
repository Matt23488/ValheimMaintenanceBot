import Discord from 'discord.js';
import * as roles from '../roles';
import { spawn } from 'child_process';
import path from 'path';

export const name = 'npm';
export const description = 'Execute npm commands.';
export const role = roles.Admin;
export const active = true;

export async function execute(message: Discord.Message, rest: string) {
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