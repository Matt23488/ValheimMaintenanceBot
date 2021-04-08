const Discord = require('discord.js');
const config = require('../../config');
const { getServerIpAddress } = require('../../ip');
const valheimServer = require('../../valheimServer');

module.exports = {
    role: null,


    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: async function (message, rest) {
        if (!valheimServer.isRunning()) message.channel.send('The server is not currently started. Use `!start` to start the server.');
        else message.channel.send(`The server is currently running at \`${getServerIpAddress()}:${config.valheim.port}\`.`);
    }
};