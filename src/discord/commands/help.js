const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'Help',
    description: 'Displays this help bubble.',

    role: null,

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: function (message, rest) {
        return new Promise(resolve => {
            const commandFiles = fs.readdirSync(__dirname);

            // message.channel.send(new Discord.MessageEmbed()

            // );
            message.channel.send(`Testing:\n\n${commandFiles.join('\n')}`);

            resolve();
        });
    }

};