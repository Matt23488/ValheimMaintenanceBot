const Discord = require('discord.js');
const path = require('path');
const valheimServer = require('../../valheimServer');
const roles = require('../roles');
const { spawn } = require('child_process');
const { getServerIpAddress } = require('../../../ip');
const config = require('../../../config');
// const { getClient } = require('../bot');
const discordBot = require('../bot');
const wsClient = require('../../wsClient');

module.exports = {
    name: 'reboot',
    description: `Reboots something. Currently supports:\n  * \`bot\` - Reboots me.\n  * \`valheim\` - Reboots ${config.valheim.name}.\n  * \`vm\` - Reboots the virtual machine. _Will require RDP to launch me and ${config.valheim.name}_.`,
    role: roles.Admin,


    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: async function (message, rest) {
        // const stopServer = valheimServer.isRunning();
        // if (stopServer) message.channel.send('Stopping server...');
        // await valheimServer.stop();
        // if (stopServer) message.channel.send('Server stopped.');

        // await message.channel.send('Rebooting VM. See you folks on the other side.');
        // spawn('shutdown', [ '/r' ], { detached: true });
        // message.client.destroy();

        // async function stopServer() {
        //     const stopServer = valheimServer.isRunning();
        //     if (stopServer) message.channel.send('Stopping server...');
        //     await valheimServer.stop();
        //     if (stopServer) message.channel.send('Server stopped.');
        // }

        switch (rest) {
            case 'bot':
                // await stopServer();
                await message.channel.send('BRB');
                wsClient.destroy();
                discordBot.getClient().destroy();
                const dir = path.join(__dirname, '../../../..');
                spawn(path.join(dir, 'startbot.bat'), [], { cwd: dir, detached: true });
                break;
            case 'valheim':
                wsClient.sendMessage('reboot');
                // await stopServer();
                // message.channel.send('Starting server...');
                // await valheimServer.start();
                // message.channel.send(`Server started at \`${getServerIpAddress()}:${config.valheim.port}\`.`);
                break;
            case 'vm':
                wsClient.sendMessage('shutdown');
                wsClient.destroy();
                // await stopServer();
                await message.channel.send('Rebooting VM. See you folks on the other side.');
                spawn('shutdown', [ '/r' ], { detached: true });
                message.client.destroy();
                process.exit();
                break;
            default:
                message.channel.send(`I don't know how to restart \`${rest}\`.`);
                break;
        }
    }
};