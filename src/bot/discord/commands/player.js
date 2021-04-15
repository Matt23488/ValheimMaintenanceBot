const Discord = require('discord.js');
const config = require('../../../config');
const { getUsers, addCharacter } = require('../../../utilities');

module.exports = {
    name: 'player',
    description: `Associate your in-game character to your Discord user, for more personalized messages. If your character's name is _Hamburger_ then you would just type \`${config.discord.commandPrefix}player Hamburger\``,
    role: null,
    active: true,

    /**
     * 
     * @param {Discord.Message} message
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: function (message, rest) {
        if (rest.length === 0) {
            message.reply('you forgot to tell me your character\'s name.');
            return Promise.resolve();
        }

        const user = getUsers().find(u => u.characters.indexOf(rest) >= 0);
        if (user) {
            message.reply(`that character belongs to <@${user.id}>.`);
            return Promise.resolve();
        }

        addCharacter(message.author.id, rest);
        message.reply('you\'ve been added.');
        return Promise.resolve();
    }
};