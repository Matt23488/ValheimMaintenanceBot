const Discord = require('discord.js');
const roles = require('../roles');
const valheimServer = require('../../valheimServer');

module.exports = {
    role: roles.Admin,

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: async function (message, rest) {
        async function exit() {
            await message.channel.send('bye');
            message.client.destroy();
        }

        if (valheimServer.isRunning()) {
            message.channel.send('Stopping server...');
            await valheimServer.stop();
            await message.channel.send('Server stopped.');
            await exit();
        } else await exit();
    }
};