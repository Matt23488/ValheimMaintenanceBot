import * as roles from '../roles';
import { spawn } from 'child_process';
import path from 'path';
import { BotCommand } from '../../../commonTypes';

export const command: BotCommand = {
    name: 'git',
    description: 'Execute git commands. Currently supports:\n * `pull` - Executes a `git pull` command.',
    role: roles.Admin,
    active: true,

    execute: (message, rest) => {
        return new Promise<void>(resolve => {
            if (rest === 'pull') {
                let output = '';
                const gitPull = spawn('git', [ rest ], { cwd: path.join(__dirname, '../../../..') });
                gitPull.stdout.on('data', data => {
                    output = output + '\n' + data.toString();
                });

                message.channel.startTyping();
                gitPull.on('close', (code, signal) => {
                    message.channel.stopTyping();
                    message.channel.send(`\`git pull\` output:\n\`\`\`${output}\`\`\``);
                    resolve();
                });

            } else {
                message.channel.send(`\`${rest}\` is an invalid \`git\` command, or I don't know how to do it.`);
                resolve();
            }
        });
    }
};