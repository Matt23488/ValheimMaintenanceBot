const Discord = require('discord.js');
const config = require('../../config');
const valheimServer = require('../valheimServer');
const commandManager = require('./commandManager');
const { getServerIpAddress } = require('../../ip');


/**
 * @type {Discord.Client}
 */
let botClient;

module.exports = {
    getClient: () => botClient,

    start: function () {
        if (botClient) return;

        botClient = new Discord.Client();

        botClient.once('ready', async () => {
            console.log(`Logged in as ${botClient.user.tag}!`);
        
            const channel = botClient.channels.cache.get(config.defaultChannel);
            channel.send('I live. Starting server...');
            await valheimServer.start();
            channel.send(`Server started at \`${getServerIpAddress()}:${config.valheim.port}\`.`);
        
            function getPlayerCountMessage() {
                return `There ${valheimServer.connectedPlayers.length === 1 ? 'is' : 'are'} currently ${valheimServer.connectedPlayers.length} player${valheimServer.connectedPlayers.length === 1 ? '' : 's'} on the server.`;
            }
        
            valheimServer.addPlayerConnectedListener(player => {
                channel.send(`Player \`${player.name}\` has joined the server! ${getPlayerCountMessage()}`);
            });
        
            valheimServer.addPlayerDisconnectedListener(player => {
                channel.send(`Player \`${player.name}\` has left the server. ${getPlayerCountMessage()}`);
            });
        });
        
        botClient.on('message', async msg => {
            const validChannel = msg.channel.type === 'dm' || msg.channel.id === config.defaultChannel;
            if (!validChannel || msg.author.bot) return;
        
            const commandInfo = commandManager.parseMessage(msg.content);
            if (commandInfo) try { await commandManager.executeCommand(commandInfo, msg); } catch (e) { console.error(e); }
        });
        
        botClient.login(config.appToken);
    }
};