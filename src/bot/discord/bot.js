const Discord = require('discord.js');
const config = require('../../config');
const commandManager = require('./commandManager');
const wsClient = require('../wsClient');
const { getUsers, sleep } = require('../../utilities');

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

            if (getUsers().find(u => u.id === msg.author.id && u.pickOn)) {
                msg.reply('quiet, you.');
                await sleep(3000);
                msg.reply('jk <:joy:831246652173844494>');
            }
        
            const commandInfo = commandManager.parseMessage(msg.content);
            if (commandInfo) try { await commandManager.executeCommand(commandInfo, msg); } catch (e) { console.error(e); }
        });
        
        botClient.login(config.appToken);
    },

    /**
     * Returns the default channel the bot announces things in.
     * @returns {Discord.TextChannel} The default channel the bot announces things in.
     */
    getDefaultChannel: () => botClient.channels.cache.get(config.defaultChannel)
};