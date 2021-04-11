const Discord = require('discord.js');

module.exports = {
    name: 'poop',
    description: 'Have the bot insult you.',
    role: null,

    /**
     * 
     * @param {Discord.Message} message
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: async function (message, rest) {
        await message.reply('you\'re 12.');
    }
};