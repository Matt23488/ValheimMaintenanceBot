const Discord = require('discord.js');
// const config = require('../../config');

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
        // await discordMessage.reply('you\'re 12');
        await message.reply('you\'re 12.');
    }
};