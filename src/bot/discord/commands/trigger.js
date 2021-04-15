const Discord = require('discord.js');
const roles = require('../roles');

module.exports = {
    name: 'trigger',
    description: 'Tests a trigger.',
    role: roles.Admin,
    active: true,

    /**
     * 
     * @param {Discord.Message} message
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: async function (message, rest) {
        const firstSpace = rest.indexOf(' ');
        const triggerType = rest.slice(0, firstSpace);
        const data = JSON.parse(rest.slice(firstSpace + 1).trim());

        message.channel.send(`TESTING TRIGGER \`${triggerType}\``);

        try {
            const trigger = require(`../../messages/${triggerType}`);
            trigger.execute(data);
        }
        catch (e) {
            message.channel.send('There was a problem testing the trigger.');
        }
    }
};