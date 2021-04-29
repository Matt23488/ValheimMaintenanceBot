import { getSettings } from '../../../config';
import * as roles from '../roles';
import * as wsClient from '../../wsClient';
import { BotCommand, ProcessBufferName } from '../../../commonTypes';

const commandPrefix = getSettings('appsettings').discord.commandPrefix;

export const command: BotCommand = {
    name: 'save',
    description: `Causes the bot show some arbitrary output in the channel. Optionally saves the output to a file on the VM if specified. Currently supports:\n * \`stdout\` - The standard output of the Valheim server. Example: \`${commandPrefix}save stdout test\` will save the last few data chunks to the file \`test.txt\` on the VM.\n * \`stderr\` - The error output of the Valheim server. Example: \`${commandPrefix}save stderr test\` will save the last few data chunks to the file \`test.txt\` on the VM.`,
    role: roles.Admin,
    active: true,

    execute: async (message, rest) => {
        if (!wsClient.isConnected()) {
            message.channel.send('The server is not running, there\'s nothing to save.');
            return;
        }
        
        const params = rest.split(' ');
        if (params[0].length === 0) {
            message.reply('save what, hoss?');
            return;
        }

        let result: string | null = null;
        if (ProcessBufferName.guard(params[0])) {
            result = await wsClient.sendRequest('save', {
                name: params[0],
                outFileName: params[1],
                author: message.author.tag
            });
        }


        if (result === null) {
            const config = getSettings('appsettings');
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
};