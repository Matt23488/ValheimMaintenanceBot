const Discord = require('discord.js');
const valheimServer = require('../../valheimServer');
const roles = require('../roles');
const { spawn } = require('child_process');

module.exports = {
    name: 'reboot',
    description: 'Reboots the VM. Saves and shuts down the Valheim server first if it\'s running.',
    role: roles.Admin,


    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: async function (message, rest) {
        const stopServer = valheimServer.isRunning();
        if (stopServer) message.channel.send('Stopping server...');
        await valheimServer.stop();
        if (stopServer) message.channel.send('Server stopped.');

        await message.channel.send('Rebooting VM. See you folks on the other side.');
        spawn('shutdown', [ '/r' ], { detached: true });
        message.client.destroy();
    }
};