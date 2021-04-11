const Discord = require('discord.js');
const config = require('../../../config');
const wsClient = require('../../wsClient');
const roles = require('../roles');

module.exports = {
    name: 'stop',
    description: 'Saves and shuts down the Valheim server if it\'s running.',
    role: roles.Admin,

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: async function (message, rest) {
        if (!wsClient.isConnected()) {
            message.channel.send(`The server is not running. Use \`${config.discord.commandPrefix}start\` to start the server.`);
            return;
        }

        const statusInfo = await wsClient.sendRequest('status');
        if (!statusInfo.isRunning) {
            message.channel.send(`The server is not running. Use \`${config.discord.commandPrefix}start\` to start the server.`);
            return;
        }
        message.channel.send('Stopping server...');
        await wsClient.sendRequest('shutdown');
        message.channel.send('The server is stopped.');
    }
}