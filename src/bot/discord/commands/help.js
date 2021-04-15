const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../../config');
const roles = require('../roles');

module.exports = {
    name: 'help',
    description: 'Displays this help bubble.',
    role: null,
    active: true,

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: function (message, rest) {
        return new Promise(resolve => {
            /**
             * @type {{ name: string, description: string, role: string, active: boolean, (message: Discord.Message, rest: string) => Promise<void>: execute }[]}
             */
            const commands = fs.readdirSync(__dirname).map(f => require(path.join(__dirname, f)));

            // TODO: Add `active` property to commands and hide them if inactive and obviously don't allow them to be executed.
            message.channel.send(new Discord.MessageEmbed()
                .setColor(0x0099ff)
                .setTitle('Command Help')
                .setDescription('Lists all commands and what they do')
                .addField('\u200B', '\u200B')
                .addFields(commands.filter(c => c.active && roles.hasRole(message, c.role)).map(c => {
                    let name = config.discord.commandPrefix + c.name;
                    if (c.role !== null && message.guild !== null) {
                        name = `${name} - _${message.guild.roles.cache.get(c.role).name} role only_`;
                    }
                    return { name, value: c.description };
                }))
            );

            resolve();
        });
    }

};