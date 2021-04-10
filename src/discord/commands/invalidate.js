const Discord = require('discord.js');
const path = require('path');
const config = require('../../config');
const roles = require('../roles');

module.exports = {
    name: 'invalidate',
    description: `In the event that a command or trigger has been updated, this command will cause the bot to pick up the change. Example: \`${config.discord.commandPrefix}invalidate command help\` would pick up any changes to the \`${config.discord.commandPrefix}help\` command.`,
    role: roles.Admin,

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: function (message, rest) {
        return new Promise(resolve => {
            const args = rest.split(' ');

            let objPath = '';
            let prefix = '';
            switch (args[0]) {
                case 'command':
                    objPath = '.';
                    prefix = config.discord.commandPrefix;
                    break;
                case 'trigger':
                    objPath = '../../triggers';
                    break;
                default:
                    message.channel.send(`I don't know how to invalidate a(n) \`${args[0]}\`.`);
                    resolve();
                    return;
            }

            args.slice(1).forEach(command => {
                try {
                    delete require.cache[require.resolve(path.join(objPath, command))];
                } catch (e) {
                    message.channel.send(`The \`${prefix}${args[0]}\` ${args[0]} does not exist.`);
                    return;
                }

                message.channel.send(`The \`${prefix}${args[0]}\` ${args[0]} has been refreshed.`);
            });
            // rest.split(' ').forEach(command => {
            //     try {
            //         delete require.cache[require.resolve(`./${command}`)];
            //     } catch (e) {
            //         message.channel.send(`The ${config.discord.commandPrefix}${command} command has not been used or does not exist.`);
            //         return;
            //     }

            //     message.channel.send(`The ${config.discord.commandPrefix}${command} command has been refreshed.`);
            // });

            resolve();
        });
    }
};