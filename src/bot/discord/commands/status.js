const Discord = require('discord.js');
const config = require('../../../config');
const { getServerIpAddress } = require('../../../ip');
const valheimServer = require('../../valheimServer');
const wsClient = require('../../wsClient');

/**
 * 
 * @param {string} str 
 * @param {number} length 
 */
function repeat(str, length) {
    let result = '';
    for (let i = 0; i < length; i++) result += str;
    return result;
}

module.exports = {
    name: 'status',
    description: 'Displays general information about the Valheim server, such as the IP Address and who is playing.',
    role: null,


    /**
     * 
     * @param {Discord.Message} message 
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: async function (message, rest) {
        /**
         * @type {{ isRunning: boolean, name: string, ip: string, connectedPlayers: string[] }}
         */
        const statusInfo = await wsClient.sendRequest('status');
        if (!statusInfo.isRunning) message.channel.send('The server is not currently started. Use `!start` to start the server.');
        else {
            try {
                const title = `${statusInfo.name} Server Status`;
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('#9900ff')
                    .setTitle(`\`${title}\``)
                    .addField(repeat('-', 50), '\u200B')
                    .addField('Server IP', statusInfo.ip)
                    .addField(repeat('-', 50), '\u200B')
                    .addField(`${statusInfo.connectedPlayers.length} player${statusInfo.connectedPlayers.length === 1 ? '' : 's'} connected:`, statusInfo.connectedPlayers.length > 0 ? statusInfo.connectedPlayers.map(p => `_${p}_`).join(', ') : '\u200B')
                    .setTimestamp()
                );
            } catch (e) { }
        }
    }
};