const Discord = require('discord.js');
const config = require('../../config');
const valheimServer = require('../../valheimServer');
const roles = require('../roles');
const fs = require('fs');
const path = require('path');

module.exports = {
    role: roles.Admin,

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: function (message, rest) {
        return new Promise(resolve => {
            if (rest.length === 0) {
                message.reply('save what, hoss?');
                resolve();
                return;
            }

            const params = rest.split(' ');
            if (params[0] === 'stdout') {
                const prefix = '`stdout` output:\n```';
                const suffix = '```';
                const output = valheimServer.stdoutBuffer.toArray().join('\n');
                const totalLength = prefix.length + suffix.length + output.length;
                let final;

                if (totalLength > 2000) final = prefix + '...' + output.substring(output.length - (2000 - prefix.length - suffix.length - 3)) + suffix;
                else final = prefix + output + suffix;
                message.channel.send(final);

                if (params[1].length > 0) fs.writeFileSync(path.join(__dirname, `../../../logs/${message.author.tag}_${params[1]}.txt`), output);

            } else message.channel.send(`\`${params[0]}\` is not a valid parameter of ${config.discord.commandPrefix}save.`);
        });
    }
};