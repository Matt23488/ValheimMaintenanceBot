import Discord from 'discord.js';
import { getAppSettings } from '../../../config';
import { BotCommand, ServerStatuses } from '../../../commonTypes';
import * as wsClient from '../../wsClient';

export type StatusCommand = BotCommand & { sendStatusEmbed: (channel: Discord.TextChannel) => Promise<void> };

async function sendStatusEmbed(channel: Discord.TextChannel) {
    const config = getAppSettings();
    if (!wsClient.isConnected()) {
        channel.send(new Discord.MessageEmbed()
            .setTitle(`${config.valheim.name} Server Status`)
            .setThumbnail('https://gamelaunchercreator.com/wp-content/uploads/2021/03/valheim-logo.png')
            .setColor(0xff0000)
            .setDescription(`The server is not currently started. Use \`${config.discord.commandPrefix}start\` to start the server.`)
            .setTimestamp()
        );
        return;
    }

    const statusInfo = (await wsClient.sendRequest('status'))!;
    const embed = new Discord.MessageEmbed()
        .setTitle(`${statusInfo.name} Server Status`)
        .setThumbnail('https://gamelaunchercreator.com/wp-content/uploads/2021/03/valheim-logo.png')
        .setTimestamp();

    switch (statusInfo.status) {
        case ServerStatuses.stopped:
            embed.setColor(0xff0000)
                .setDescription(`The server is currently stopped. Use ${config.discord.commandPrefix}start to start the server.`);
            break;
        case ServerStatuses.starting:
            embed.setColor(0xffff00)
                .setDescription(`The server is in the process of starting. I'll let you know when it's started. If I don't, please alert <@${config.discord.parentalUnit}>.`);
            break;
        case ServerStatuses.ready:
            embed.setColor(0x00ff00)
                .setDescription('The server is running.')
                .addField('Server IP', `_${statusInfo.ip}_`, true)
                .addField('Password', `_${statusInfo.password}_`, true)
                .addField('Uptime', `_${statusInfo.uptime} (active for ${statusInfo.activeUptime})_`)
                .addFields(statusInfo.connectedPlayers.map(p => { return { name: p.name, value: `_${p.uptime}_`, inline: true }; }))
            break;
        default:
            embed.setColor(0xff0000)
                .setDescription(`I can't determine the server status for some reason. <@${config.discord.parentalUnit}> needs to look into it.`);
    }

    channel.send(embed);
}

export const command: StatusCommand = {
    name: 'status',
    description: 'Displays general information about the Valheim server, such as the IP Address and who is playing.',
    role: null,
    active: true,

    execute: (message, rest) => {
        return sendStatusEmbed(message.channel as Discord.TextChannel);
    },

    sendStatusEmbed
};