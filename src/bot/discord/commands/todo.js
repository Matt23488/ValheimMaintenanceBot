const Discord = require('discord.js');
const config = require('../../../config');

const todoList = [
    { name: 'Personality', value: 'I want all of my response messages to come from a great Viking warrior.' },
    { name: 'World Stuff', value: 'I want to be able to create/restore backups of the world, as well as change the world that is hosted. Low priority.' }
];

module.exports = {
    name: 'todo',
    description: 'Lists upcoming changes.',
    role: null,

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: function (message, rest) {
        return new Promise(resolve => {
            message.channel.send(new Discord.MessageEmbed()
                .setTitle('Upcoming Changes')
                .setColor('#9900ff')
                .addFields(todoList)
            );
            resolve();
        });
    }
};