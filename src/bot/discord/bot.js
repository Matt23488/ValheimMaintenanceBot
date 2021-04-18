const Discord = require('discord.js');
const config = require('../../config');
const commandManager = require('./commandManager');
const wsClient = require('../wsClient');
const { getUsers, sleep, nPercentChance } = require('../../utilities');
const badWords = require('badwords/regexp');
const say = require('say');
const fs = require('fs');

/**
 * @type {Discord.Client}
 */
let botClient;

/**
 * @type {Discord.VoiceChannel}
 */
let voice;

/**
 * @type {Discord.VoiceConnection}
 */
let voiceConnection;

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
            voice = botClient.channels.cache.get(config.defaultVoiceChannel);
            wsClient.onConnected(async () => {
                const statusInfo = await wsClient.sendRequest('status');
                if (statusInfo.connectedPlayers.length > 0) this.joinVoice();
            });

            wsClient.onMessage('playerConnected', async () => {
                const statusInfo = await wsClient.sendRequest('status');
                if (statusInfo.connectedPlayers.length === 1) this.joinVoice();
            });

            wsClient.onMessage('playerDisconnected', async () => {
                const statusInfo = await wsClient.sendRequest('status');
                if (statusInfo.connectedPlayers.length === 0) this.leaveVoice();
            });
            
            // botClient.channels.cache.get(config.defaultChannel).send('Odin has granted me life again.');
            wsClient.connect();
        });
        
        botClient.on('message', async msg => {
            const validChannel = msg.channel.type === 'dm' || msg.channel.id === config.defaultChannel;
            if (!validChannel || msg.author.bot) return;

            if (msg.content.match(badWords) && nPercentChance(10)) {
                msg.channel.send(`<@${msg.author.id}>`);
                msg.channel.send({ files: ['https://pa1.narvii.com/6608/cd9477ab5325b13701e0deba56df6ba3fd2ba56a_00.gif'] });
            }
        
            const commandInfo = commandManager.parseMessage(msg.content);
            if (commandInfo) {
                if (getUsers().find(u => u.id === msg.author.id && u.pickOn) && nPercentChance(25)) {
                    msg.reply('quiet, you.');
                    await sleep(3000);
                    msg.reply('jk <:joy:831246652173844494>');
                }

                try { await commandManager.executeCommand(commandInfo, msg); } catch (e) { console.error(e); }
            }
        });
        
        botClient.login(config.appToken);
    },

    /**
     * Returns the default channel the bot announces things in.
     * @returns {Discord.TextChannel} The default channel the bot announces things in.
     */
    getDefaultChannel: () => botClient.channels.cache.get(config.defaultChannel),

    joinVoice: function () {
        voice.join().then(connection => voiceConnection = connection).then(() => this.speak('What\'s up, bitches?'));
    },

    leaveVoice: function () {
        voiceConnection.disconnect();
        voiceConnection = null;
    },

    speak: function (message) {
        if (!voiceConnection) return;

        const ms = new Date().getTime();
        say.export(message, null, null, `${ms}.wav`, err => {
            const dispatcher = voiceConnection.play(`${ms}.wav`);

            // dispatcher.on('start', () => {
            //     console.log(`saying '${data}'`);
            // });

            dispatcher.on('finish', () => {
                fs.unlinkSync(`${ms}.wav`);
            });

            dispatcher.on('error', console.error);

        });
    }
};