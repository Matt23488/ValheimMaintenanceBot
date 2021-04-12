const Discord = require('discord.js');
const config = require('../../../config');
const roles = require('../roles');
const fs = require('fs');
const path = require('path');
const wsClient = require('../../wsClient');

module.exports = {
    name: 'save',
    description: `~~Causes the bot show some arbitrary output in the channel. Optionally saves the output to a file on the VM if specified. Currently supports:\n  * \`stdout\` - The standard output of the Valheim server. Example: \`${config.discord.commandPrefix}save stdout test\` will save the last few data chunks to the file \`test.txt\` on the VM.~~\nThis command is broken.`,
    role: roles.Admin,

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: async function (message, rest) {
        if (!wsClient.isConnected()) {
            message.channel.send('The server is not running, there\'s nothing to save.');
            return;
        }
        
        const params = rest.split(' ');
        if (params.length === 0) {
            message.reply('save what, hoss?');
            return;
        }

        /**
         * @type {string}
         */
        const result = await wsClient.sendRequest('save', {
            name: params[0],
            outFileName: params[1] || null,
            author: message.author.tag
        });

        if (!result) {
            message.channel.send(`\`${params[0]}\` is not a valid parameter of ${config.discord.commandPrefix}save.`);
            return;
        }

        const prefix = `\`${params[0]}\` output:\n\`\`\``;
        const suffix = '```';
        const totalLength = prefix.length + suffix.length + result.length;
        let final;

        if (totalLength > 2000) final = prefix + '...' + result.substring(result.length - (2000 - prefix.length - suffix.length - 3)) + suffix;
        else final = prefix + result + suffix;
        message.channel.send(final);

        // if (params[0] === 'stdout') {
        //     const result = await wsClient.sendRequest('save', {
        //         name: params[0],
        //         outFileName: params[1] || null
        //     });

        // } else message.channel.send(`\`${params[0]}\` is not a valid parameter of ${config.discord.commandPrefix}save.`);


        // return message.channel.send('That command is broken right now.');

        // return;
        // return new Promise(resolve => {
        //     if (rest.length === 0) {
        //         message.reply('save what, hoss?');
        //         resolve();
        //         return;
        //     }

        //     const params = rest.split(' ');
        //     if (params[0] === 'stdout') {
        //         const prefix = '`stdout` output:\n```';
        //         const suffix = '```';
        //         const output = valheimServer.stdoutBuffer.toArray().join('\n');
        //         const totalLength = prefix.length + suffix.length + output.length;
        //         let final;

        //         if (totalLength > 2000) final = prefix + '...' + output.substring(output.length - (2000 - prefix.length - suffix.length - 3)) + suffix;
        //         else final = prefix + output + suffix;
        //         message.channel.send(final);

        //         if (params[1].length > 0) fs.writeFileSync(path.join(__dirname, `../../../logs/${message.author.tag}_${params[1]}.txt`), output);

        //     } else message.channel.send(`\`${params[0]}\` is not a valid parameter of ${config.discord.commandPrefix}save.`);
        // });
    }
};