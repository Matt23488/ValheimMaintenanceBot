const Discord = require('discord.js');
const config = require('../../../config');

const todoList = [
    { name: 'Valheim Server and Bot Separation', value: `I want to put an api between myself (the bot) and the \`${config.valheim.name}\` server. This will allow me to be taken down without affecting players playing. **Currently working on this and some features are broken as a result.**` },
    { name: 'World Stuff', value: 'I want to be able to create/restore backups of the world, as well as change the world that is hosted. Low priority.' },
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