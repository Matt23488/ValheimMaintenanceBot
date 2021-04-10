const Discord = require('discord.js');
const roles = require('../roles');
// const valheimServer = require('../../valheimServer');
const wsClient = require('../../wsClient');

module.exports = {
    name: 'kill',
    description: 'Shuts down the bot. Saves and shuts down the Valheim server first if it\'s running.',
    role: roles.Admin,

    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: async function (message, rest) {
        // if (valheimServer.isRunning()) {
        //     message.channel.send('Stopping server...');
        //     await valheimServer.stop();
        //     await message.channel.send('Server stopped.');
        // }

        if (wsClient.isConnected()) wsClient.destroy();//wsClient.getWsClient().close();

        await message.channel.send('bye');
        message.client.destroy();
    }
};