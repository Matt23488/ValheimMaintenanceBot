const Discord = require('discord.js');
const config = require('../../config');
const valheimServer = require('../../valheimServer');
const roles = require('../roles');

module.exports = {
    role: roles.Admin,

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: async function (message, rest) {
        if (!valheimServer.isRunning()) message.channel.send(`The server is not running. Use \`${config.discord.commandPrefix}start\` to start the server.`);
        else {
            message.channel.send('Stopping server...');
            await valheimServer.stop();
            message.channel.send('Server stopped.');
        }
    }
}