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
            /**
             * @type {{ name: string, description: string, role: string, (message: Discord.Message, rest: string) => Promise<void>: execute}[]}
             */
            const commands = fs.readdirSync(__dirname).map(f => require(path.join(__dirname, f)));

            message.channel.send(new Discord.MessageEmbed()
                .setColor('#9900ff')
                .setTitle('Command Help')
                .setDescription('Lists all commands and what they do')
                .addFields(commands.map(c => {
                    let name = c.name;
                    if (c.role !== null) {
                        name = `${name} - _${message.guild.roles.cache.get(c.role).name} role only_`;
                    }
                    return { name, value: c.description };
                }))
                .setTimestamp()
            );
            // message.channel.send(`Testing:\n\n${commands.map(c => c.name).join('\n')}`);

            resolve();
        });
    }

};