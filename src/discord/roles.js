const Discord = require('discord.js');
const config = require('../config');

module.exports = {
    Admin: '829058617159319592',
    Everyone: '540237369488441356',

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} role 
     * @returns {boolean}
     */
    hasRole: function (message, role) {
        if (!role) return true;
        if (message.author.id === config.parentalUnit) return true;
        if (message.channel.type !== 'text') return false;
        if (!message.member?.roles?.cache?.has(role) ?? true) return false;

        return true;
    }
};