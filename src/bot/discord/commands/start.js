const Discord = require('discord.js');
const { spawn } = require('child_process');
const config = require('../../../config');
const { getServerIpAddress } = require('../../../ip');
const valheimServer = require('../../valheimServer');
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
        /**
         * await message.channel.send('BRB');
                wsClient.destroy();
                discordBot.getClient().destroy();
                const dir = path.join(__dirname, '../../../..');
                spawn(path.join(dir, 'startbot.bat'), [], { cwd: dir, detached: true });
                break;
         */

        if (wsClient.isConnected()) {
            const serverInfo = await wsClient.sendRequest('status');
            message.channel.send(`The server is already running at \`${serverInfo.ip}\`.`);
            return;
        }

        message.channel.send('Starting server...');
        const dir = path.join(__dirname, '../../../..');
        spawn(path.join(dir, 'startserver.bat'), [], { cwd: dir, detached: true });

        // if (valheimServer.isRunning()) message.channel.send(`The server is already running at \`${getServerIpAddress()}:${config.valheim.port}\`.`);
        // else {
        //     message.channel.send('Starting server...');
        //     // wsClient.sendMessage('start');
        //     // await valheimServer.start();
        //     // message.channel.send(`Server started at \`${getServerIpAddress()}:${config.valheim.port}\`.`);
        // }
    }
};