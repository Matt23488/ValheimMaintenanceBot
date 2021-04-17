const Discord = require('discord.js');
const config = require('../../config');

module.exports = {
    Admin: '829058617159319592',
    Everyone: '540237369488441356',

    /**
     * Determines if the message author is authorized based on the role provided.
     * @param {Discord.Message} message The `Discord.Message` object that initiated the request.
     * @param {string} role The Discord role id to check against.
     * @returns {boolean} True if the message author is authorized, otherwise false.
     */
    hasRole: function (message, role) {
        // If no role is provided, the user is authorized.
        if (!role) return true;

        // If the message author is the bot owner, the user is authorized.
        if (message.author.id === config.parentalUnit) return true;

        // If the channel is not a text channel, the user is not authorized.
        if (message.channel.type !== 'text') return false;

        // If the user is not a guild member, they are not authorized.
        if (!message.member) return false;

        // Otherwise, check the guild member's role cache for the supplied role.
        return message.memeber.roles.cache.has(role);
    }
};