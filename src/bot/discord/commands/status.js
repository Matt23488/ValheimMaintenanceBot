const Discord = require('discord.js');
const config = require('../../../config');
const wsClient = require('../../wsClient');

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
        if (!wsClient.isConnected()) {
            message.channel.send(`The server is not currently started. Use \`${config.discord.commandPrefix}start\` to start the server.`);
            message.channel.send(new Discord.MessageEmbed()
                .setTitle('Valheim Server Status')
                .setColor(0xff0000)
                .setDescription(`The server is not currently started. Use \`${config.discord.commandPrefix}start\` to start the server.`)
                .setTimestamp()
            );
            return;
        }

        /**
         * @type {{ status: number, statuses: any, name: string, ip: string, connectedPlayers: string[] }}
         */
        const statusInfo = await wsClient.sendRequest('status');
        const embed = new Discord.MessageEmbed()
            .setTitle(`${statusInfo.name} Server Status`)
            .setTimestamp();

        switch (statusInfo.status) {
            case statusInfo.statuses.stopped:
                embed.setColor(0xff0000)
                    .setDescription(`The server is currently stopped. Use ${config.discord.commandPrefix}start to start the server.`);
                break;
            case statusInfo.statuses.starting:
                embed.setColor(0xffff00)
                    .setDescription(`The server is in the process of starting. I'll let you know when it's started. If I don't, please alert <@${config.parentalUnit}>.`);
                break;
            case statusInfo.statuses.ready:
                embed.setColor(0x00ff00)
                    .setDescription('The server is running.')
                    .addField('Server IP', `\`${statusInfo.ip}\``)
                    .addField(`${statusInfo.connectedPlayers.length} player${statusInfo.connectedPlayers.length === 1 ? '' : 's'} connected`, statusInfo.connectedPlayers.length > 0 ? statusInfo.connectedPlayers.map(p => `_${p}_`).join(', ') : '\u200B')
                break;
            default:
                embed.setColor(0xff0000)
                    .setDescription(`I can't determine the server status for some reason. <@${config.parentalUnit}> needs to look into it.`);
        }

        message.channel.send(embed);
    }
};