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
        /**
         * @type {{ name: string, description: string, role: string, active: boolean, (message: Discord.Message, rest: string) => Promise<void>: execute }[]}
         */
        const commands = fs.readdirSync(__dirname).map(f => require(path.join(__dirname, f)));

        message.channel.send({
            embed: {
                color: 0x0099ff,
                title: 'Command Help',
                description: 'Lists all commands and what they do',
                fields: [{ name: '\u200B', value: '\u200B' }, ...commands.filter(c => c.active && roles.hasRole(message, c.role)).map(c => {
                    let name = config.discord.commandPrefix + c.name;
                    if (c.role !== null && message.guild !== null) {
                        name = `${name} - _${message.guild.roles.cache.get(c.role).name} role only_`;
                    }
                    return { name, value: c.description };
                })]
            }
        });

        return Promise.resolve();
    }

};