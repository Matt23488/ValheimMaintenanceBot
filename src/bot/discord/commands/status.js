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
            message.channel.send(new Discord.MessageEmbed()
                .setTitle('Valheim Server Status')
                .setThumbnail('https://www.irongatestudio.se/____impro/1/onewebmedia/valheim_V.png?etag=%22519-5ed92f63%22&sourceContentType=image%2Fpng&ignoreAspectRatio&resize=38%2B38')
                .setColor(0xff0000)
                .setDescription(`The server is not currently started. Use \`${config.discord.commandPrefix}start\` to start the server.`)
                .setTimestamp()
            );
            return;
        }

        /**
         * @type {{ status: number, statuses: any, name: string, ip: string, connectedPlayers: { name: string, uptime: string }[], uptime: string }}
         */
        const statusInfo = await wsClient.sendRequest('status');
        const embed = new Discord.MessageEmbed()
            .setTitle(`${statusInfo.name} Server Status`)
            .setThumbnail('https://www.irongatestudio.se/____impro/1/onewebmedia/valheim_V.png?etag=%22519-5ed92f63%22&sourceContentType=image%2Fpng&ignoreAspectRatio&resize=38%2B38')
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
                    .addField('Uptime', `${statusInfo.uptime}`)
                    .addField('\u200B', `${statusInfo.connectedPlayers.length} player${statusInfo.connectedPlayers.length === 1 ? '' : 's'} connected`)
                    .addFields(statusInfo.connectedPlayers.map(p => { return { name: p.name, value: `${p.uptime}`, inline: true }; }))
                break;
            default:
                embed.setColor(0xff0000)
                    .setDescription(`I can't determine the server status for some reason. <@${config.parentalUnit}> needs to look into it.`);
        }

        message.channel.send(embed);
    }
};