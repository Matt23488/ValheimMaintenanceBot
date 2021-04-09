const Discord = require('discord.js');
const config = require('../../config');
const roles = require('../roles');

module.exports = {
    name: 'invalidate',
    description: `In the event that a command has been updated, this command will cause the bot to pick up the change. Example: \`${config.discord.commandPrefix}invalidate help\` would pick up any changes to the \`${config.discord.commandPrefix}help\` command.`,
    role: roles.Admin,

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: function (message, rest) {
        return new Promise(resolve => {
            rest.split(' ').forEach(command => {
                try {
                    delete require.cache[require.resolve(`./${command}`)];
                } catch (e) {
                    message.channel.send(`The ${config.discord.commandPrefix}${command} command has not been used or does not exist.`);
                    return;
                }

                message.channel.send(`The ${config.discord.commandPrefix}${rest} command has been refreshed.`);
            });

            resolve();
        });
    }
};