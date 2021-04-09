const Discord = require('discord.js');

module.exports = {
    name: 'Ping',
    description: 'Have the bot reply "pong" to you. Mainly used to test that the bot is responsive.',
    role: null,

    /**
     * 
     * @param {Discord.Message} message
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: async function (message, rest) {
        await message.reply('pong');
    }
};