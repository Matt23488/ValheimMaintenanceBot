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
        return new Promise(resolve => {
            try {
                delete require.cache[require.resolve(`./${rest}`)];
            } catch (e) {
                message.channel.send(`The ${config.discord.commandPrefix}${rest} command has not been used or does not exist.`);
                resolve();
                return;
            }

            message.channel.send(`The ${config.discord.commandPrefix}${rest} command has been refreshed.`);
            resolve();
        });
    }
};