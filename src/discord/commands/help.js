const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

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
            const commands = fs.readdirSync(__dirname).map(f => require(path.join(__dirname, f)));

            // message.channel.send(new Discord.MessageEmbed()

            // );
            message.channel.send(`Testing:\n\n${commands.map(c => c.name).join('\n')}`);

            resolve();
        });
    }

};