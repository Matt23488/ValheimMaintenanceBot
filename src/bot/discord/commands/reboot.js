const Discord = require('discord.js');
const path = require('path');
const roles = require('../roles');
const { spawn } = require('child_process');
const config = require('../../../config');
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
        switch (rest) {
            case 'bot':
                await message.channel.send('BRB');
                wsClient.destroy();
                discordBot.getClient().destroy();
                const dir = path.join(__dirname, '../../../..');
                spawn(path.join(dir, 'startbot.bat'), [], { cwd: dir, detached: true });
                process.exit();
                break;
            case 'valheim':
                if (!wsClient.isConnected()) {
                    message.channel.send('Valheim server isn\'t started, but I\'ll go ahead and start it for you...');
                    require('./start').execute(message, rest);
                    break;
                }

                message.channel.send('Rebooting Valheim Server...');
                await wsClient.sendRequest('shutdown');
                require('./start').execute(message, rest);
                break;
            case 'vm':
                if (wsClient.isConnected()) {
                    const statusInfo = await wsClient.sendRequest('status');
                    if (!statusInfo.isRunning) {
                        message.channel.send('Stopping server...');
                        await wsClient.sendRequest('shutdown');
                    }
                    wsClient.destroy();
                }
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