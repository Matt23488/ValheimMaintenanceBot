const Discord = require('discord.js');
const config = require('../../config');
const commandManager = require('./commandManager');
const wsClient = require('../wsClient');

/**
 * @type {Discord.Client}
 */
let botClient;

module.exports = {
    /**
     * Gets the Discord client object associated with the bot.
     * @returns {Discord.Client} The Discord client object.
     */
    getClient: () => botClient,

    /**
     * Initiates the Discord client and turns on the bot.
     * @returns {void}
     */
    start: function () {
        if (botClient) return;

        botClient = new Discord.Client();

        botClient.once('ready', () => {
            console.log(`Logged in as ${botClient.user.tag}!`);
            // botClient.channels.cache.get(config.defaultChannel).send('Odin has granted me life again.');
            wsClient.connect();
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