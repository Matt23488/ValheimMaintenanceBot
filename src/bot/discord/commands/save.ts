import Discord from 'discord.js';
import { getAppSettings } from '../../../config';
import * as roles from '../roles';
import * as wsClient from '../../wsClient';

const commandPrefix = getAppSettings().discord.commandPrefix;
export const name = 'save';
export const description = `Causes the bot show some arbitrary output in the channel. Optionally saves the output to a file on the VM if specified. Currently supports:\n * \`stdout\` - The standard output of the Valheim server. Example: \`${commandPrefix}save stdout test\` will save the last few data chunks to the file \`test.txt\` on the VM.\n * \`stderr\` - The error output of the Valheim server. Example: \`${commandPrefix}save stderr test\` will save the last few data chunks to the file \`test.txt\` on the VM.`;
export const role = roles.Admin;
export const active = true;

export async function execute(message: Discord.Message, rest: string) {
    if (!wsClient.isConnected()) {
        message.channel.send('The server is not running, there\'s nothing to save.');
        return;
    }
    
    const params = rest.split(' ');
    if (params[0].length === 0) {
        message.reply('save what, hoss?');
        return;
    }

    const result: string | null = await wsClient.sendRequest('save', {
        name: params[0],
        outFileName: params[1] || null,
        author: message.author.tag
    });

    if (result === null) {
        const config = getAppSettings();
        message.channel.send(`\`${params[0]}\` is not a valid parameter of ${config.discord.commandPrefix}save.`);
        return;
    }

    const prefix = `\`${params[0]}\` output:\n\`\`\``;
    const suffix = '```';
    const totalLength = prefix.length + suffix.length + result.length;
    let final;

    if (totalLength > 2000) final = prefix + '...' + result.substring(result.length - (2000 - prefix.length - suffix.length - 3)) + suffix;
    else final = prefix + (result || '\n') + suffix;
    message.channel.send(final);
}