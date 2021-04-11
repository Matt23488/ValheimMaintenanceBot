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
        // return new Promise(resolve => {
        //     // if (!valheimServer.isRunning()) message.channel.send('The server is not currently started. Use `!start` to start the server.');
        //     // else {
        //     //     try {
        //     //         const title = `${config.valheim.name} Server Status`;
        //     //         message.channel.send(new Discord.MessageEmbed()
        //     //             .setColor('#9900ff')
        //     //             .setTitle(`\`${title}\``)
        //     //             .addField(`\`${repeat('-', title.length)}\``, '\u200B')
        //     //             .addField('Server IP', `\`${getServerIpAddress()}:${config.valheim.port}\``)
        //     //             .addField(`\`${repeat('-', title.length)}\``, '\u200B')
        //     //             .addField(`${valheimServer.connectedPlayers.length} player${valheimServer.connectedPlayers.length === 1 ? '' : 's'} connected:`, valheimServer.connectedPlayers.length > 0 ? valheimServer.connectedPlayers.map(p => `_${p.name}_`).join(', ') : '\u200B')
        //     //             .setTimestamp()
        //     //         );
        //     //     } catch (e) { }
        //     // }
        //     // resolve();
        //     //wsClient.sendMessage('status');
        //     wsClient.
        //     resolve();
        // });

        /*
const statusInfo = {
            isRunning: valheimServer.getStatus() === valheimServer.statuses.ready,
            name: config.valheim.name,
            ip: `${getServerIpAddress()}:${config.valheim.port}`,
            connectedPlayers: valheimServer.connectedPlayers.map(p => p.name)
        };
        */

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