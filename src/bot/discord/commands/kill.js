const Discord = require('discord.js');
const roles = require('../roles');
const wsClient = require('../../wsClient');

module.exports = {
    name: 'kill',
    description: 'Shuts down the bot.',
    role: roles.Admin,

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: async function (message, rest) {
        if (wsClient.isConnected()) wsClient.destroy();

        await message.channel.send('bye');
        message.client.destroy();
        process.exit(0);
    }
};