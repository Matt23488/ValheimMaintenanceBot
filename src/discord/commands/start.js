const Discord = require('discord.js');
const config = require('../../config');
const { getServerIpAddress } = require('../../ip');
const valheimServer = require('../../valheimServer');

module.exports = {
    name: 'Start',
    description: 'Starts the Valheim server if it\'s not already running.',
    role: null,

    /**
     * @param {Discord.Message} message
     * @param {string} rest
     * @returns {Promise<void>}
     */
    execute: async function (message, rest) {
        if (valheimServer.isRunning()) message.channel.send(`The server is already running at \`${getServerIpAddress()}:${config.valheim.port}\`.`);
        else {
            message.channel.send('Starting server...');
            await valheimServer.start();
            message.channel.send(`Server started at \`${getServerIpAddress()}:${config.valheim.port}\`.`);
        }
    }
};