const Discord = require('discord.js');
const roles = require('../roles');
const discordBot = require('../bot');

module.exports = {
    name: 'voice',
    description: '',
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
                break;
            case 'd':
            case 'disable':
            case 'disabled':
            case 'f':
            case 'false':
                discordBot.setVoiceEnabled(false);
                break;
        }
        return Promise.resolve();
    }
};