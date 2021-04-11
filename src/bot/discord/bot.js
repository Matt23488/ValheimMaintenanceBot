const Discord = require('discord.js');
const config = require('../../config');
const commandManager = require('./commandManager');
const wsClient = require('../wsClient');

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
            await wsClient.connect();
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