const Discord = require('discord.js');
const config = require('../../../config');

const todoList = [
    { name: 'uptime', value: `I want to keep track of server uptime and player playtime. This will be displayed as part of the \`${config.discord.commandPrefix}status\` command.` },
    { name: 'world stuff', value: 'I want to be able to create/restore backups of the world, as well as change the world that is hosted. Low priority.' },
    { name: 'api separation', value: `I want to put an api between myself (the bot) and the \`${config.valheim.name}\` server. This will allow me to be taken down without affecting players playing.` }
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
        });
    }
};