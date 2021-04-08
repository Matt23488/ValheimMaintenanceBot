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
        else message.channel.send(new Discord.MessageEmbed()
            .setColor('#9900ff')
            .setTitle(`${config.valheim.name} Server Status`)
            .addField('Server IP', `${getServerIpAddress()}:${config.valheim.port}`)
            .addField(`${valheimServer.connectedPlayers.length} player${valheimServer.connectedPlayers.length === 1 ? '' : 's'} connected:`, valheimServer.connectedPlayers.length > 0 ? valheimServer.connectedPlayers.map(p => p.name).join(', ') : '\u200B')
            .setTimestamp()
        );
    }
};