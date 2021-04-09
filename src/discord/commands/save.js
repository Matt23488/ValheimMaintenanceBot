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
                message.channel.send(`\`stdout\` output:\n\`\`\`${valheimServer.stdoutBuffer.toArray().join('\n')}\`\`\``)
            } else message.channel.send(`\`${rest}\` is not a valid parameter of ${config.discord.commandPrefix}save.`);
        });
    }
};