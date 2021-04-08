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
        // else message.channel.send(`The server is currently running at \`${getServerIpAddress()}:${config.valheim.port}\`.`);
        else {
            const embed = new Discord.MessageEmbed()
                .setColor('#9900ff')
                .setTitle(`${config.valheim.name} Server Status`)
                .addField('Connected players', `${valheimServer.connectedPlayers.length} player${valheimServer.connectedPlayers.length === 1 ? '' : 's'} connected`);

            valheimServer.connectedPlayers.forEach(p => embed.addField(p.name, '\u200B', true));

            embed.setTimestamp();
            embed.spliceFields()

            message.channel.send(embed);
        }
    }
};