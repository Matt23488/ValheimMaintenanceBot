const Discord = require('discord.js');
const path = require('path');
const { spawn } = require('child_process');
const wsClient = require('../../wsClient');

module.exports = {
    name: 'start',
    description: 'Starts the Valheim server if it\'s not already running.',
    role: null,

    /**
     * @param {Discord.Message} message
     * @param {string} rest
     * @returns {Promise<void>}
     */
    execute: async function (message, rest) {
        if (wsClient.isConnected()) {
            const serverInfo = await wsClient.sendRequest('status');
            message.channel.send(`The server is already running at \`${serverInfo.ip}\`.`);
            return;
        }

        message.channel.send('Starting server...');
        const dir = path.join(__dirname, '../../../..');
        spawn(path.join(dir, 'startserver.bat'), [], { cwd: dir, detached: true });
    }
};