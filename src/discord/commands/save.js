const Discord = require('discord.js');
const config = require('../../config');
const valheimServer = require('../../valheimServer');
const roles = require('../roles');

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
            if (rest === 'stdout') {
                const prefix = '`stdout` output:\n```';
                const suffix = '```';
                const output = valheimServer.stdoutBuffer.toArray().join('\n');
                const totalLength = prefix.length + suffix.length + output.length;
                let final;

                if (totalLength > 2000) final = prefix + '...' + output.substring(output.length - 2000 - prefix.length - suffix.length + 3) + suffix;
                else final = prefix + output + suffix;

                //const final = prefix + output.substring(output.length - 2000 - prefix.length - suffix.length);

                console.log(final.length);
                message.channel.send(final);
            } else message.channel.send(`\`${rest}\` is not a valid parameter of ${config.discord.commandPrefix}save.`);
        });
    }
};