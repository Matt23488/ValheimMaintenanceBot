const Discord = require('discord.js');
const roles = require('../roles');
const discordBot = require('../bot');

module.exports = {
    name: 'voice',
    description: 'Tells you if the bot will join voice or not, or set if it can or not.',
    role: roles.Admin,
    active: true,

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: function (message, rest) {
        switch (rest.toLocaleLowerCase()) {
            case '':
                message.channel.send(`Voice is currently _${discordBot.getVoiceEnabled() ? 'enabled' : 'disabled'}_.`);
                break;
            case 'e':
            case 'enable':
            case 'enabled':
            case 't':
            case 'true':
                discordBot.setVoiceEnabled(true);
                message.channel.send('Voice enabled successfully.');
                break;
            case 'd':
            case 'disable':
            case 'disabled':
            case 'f':
            case 'false':
                discordBot.setVoiceEnabled(false);
                message.channel.send('Voice disabled successfully.');
                break;
        }
        return Promise.resolve();
    }
};