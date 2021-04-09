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
    execute: function (message, rest) {
        return new Promise(resolve => {
            if (!valheimServer.isRunning()) message.channel.send('The server is not currently started. Use `!start` to start the server.');
            else {
                try {
                    message.channel.send(new Discord.MessageEmbed()
                        .setColor('#9900ff')
                        .setTitle(`${config.valheim.name} Server Status`)
                        .addField('Server IP', `\`${getServerIpAddress()}:${config.valheim.port}\``)
                        .addField('\u200B', '\u200B')
                        .addField(`${valheimServer.connectedPlayers.length} player${valheimServer.connectedPlayers.length === 1 ? '' : 's'} connected:`, valheimServer.connectedPlayers.length > 0 ? valheimServer.connectedPlayers.map(p => `_${p.name}_`).join(', ') : '\u200B')
                        .setTimestamp()
                    );
                } catch (e) { }
            }
            resolve();
        });
    }
};