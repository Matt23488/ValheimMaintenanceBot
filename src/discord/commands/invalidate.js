const Discord = require('discord.js');
const config = require('../../config');
const roles = require('../roles');

module.exports = {
    role: roles.Admin,

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: async function (message, rest) {
        rest = rest.trim(); // TODO: remove this at some point when it's no longer necessary
        try {
            delete require.cache[require.resolve(`./${rest}`)];
        } catch (e) {
            message.channel.send(`The ${config.discord.commandPrefix}${rest} command has not been used or does not exist.`);
            return;
        }

        message.channel.send(`The ${config.discord.commandPrefix}${rest} command has been refreshed.`);
    }
};