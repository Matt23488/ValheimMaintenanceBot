const Discord = require('discord.js');

const todoList = [
    { name: 'Personality', value: 'I want all of my response messages to come from a great Viking warrior.' },
    { name: 'World Stuff', value: 'I want to be able to restore backups of the world, as well as change the world that is hosted. Low priority.' }
];

module.exports = {
    name: 'todo',
    description: 'Lists upcoming changes.',
    role: null,
    active: true,

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: function (message, rest) {
        message.channel.send({
            embed: {
                color: 0x9900ff,
                title: 'Upcoming Changes',
                fields: todoList
            }
        });
        return Promise.resolve();
    }
};