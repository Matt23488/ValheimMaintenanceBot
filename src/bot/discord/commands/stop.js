const Discord = require('discord.js');
const config = require('../../../config');
const valheimServer = require('../../valheimServer');
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
        // if (!valheimServer.isRunning()) message.channel.send(`The server is not running. Use \`${config.discord.commandPrefix}start\` to start the server.`);
        // else {
        //     message.channel.send('Stopping server...');
        //     await valheimServer.stop();
        //     message.channel.send('Server stopped.');
        // }
        wsClient.sendMessage('shutdown');
    }
}