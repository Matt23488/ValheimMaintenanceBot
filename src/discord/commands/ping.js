const Discord = require('discord.js');

module.exports = {
    role: null,

    /**
     * 
     * @param {Discord.Message} message
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: async function (message, rest) {
        await message.reply('pang');
    }
};