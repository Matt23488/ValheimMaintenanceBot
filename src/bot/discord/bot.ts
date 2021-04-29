import Discord from 'discord.js';
import { getSettings } from '../../config';
import * as commandManager from './commandManager';
import * as wsClient from '../wsClient';
import { nPercentChance } from '../../utilities';
import badWords from 'badwords/regexp';
import say from 'say';
import fs from 'fs';

let botClient: Discord.Client;
let voice: Discord.VoiceChannel;
let voiceEnabled = true;
let voiceConnection: Discord.VoiceConnection | null;

/**
 * Gets the Discord client object associated with the bot.
 * @returns The Discord client object.
 */
export const getClient = () => botClient;

/**
 * Initiates the Discord client and turns on the bot.
 */
export function start() {
    if (botClient) return;

    botClient = new Discord.Client();

    botClient.once('ready', () => {
        const config = getSettings('appsettings');
        console.log(`Logged in as ${botClient.user!.tag}!`);
        voice = botClient.channels.cache.get(config.discord.defaultVoiceChannel) as Discord.VoiceChannel;
        wsClient.onConnected(async () => {
            if (!voiceEnabled) return;

            const statusInfo = await wsClient.sendRequest('status');
            if (statusInfo && statusInfo.connectedPlayers.length > 0) joinVoice();
        });

        wsClient.onMessage('playerConnected', async () => {
            if (!voiceEnabled) return;
            
            const statusInfo = await wsClient.sendRequest('status');
            if (statusInfo && statusInfo.connectedPlayers.length === 1) joinVoice();
        });

        wsClient.onMessage('playerDisconnected', async () => {
            if (!voiceEnabled) return;
            
            const statusInfo = await wsClient.sendRequest('status');
            if (statusInfo && statusInfo.connectedPlayers.length === 0) leaveVoice();
        });
        
        botClient.users.fetch(config.discord.parentalUnit).then(parentalUnit => {
            parentalUnit.createDM().then(dm => {
                dm.send(`I live at ${getDefaultChannel()} on ${getDefaultChannel().guild}`);
            });
        });
        wsClient.connect();
    });
    
    botClient.on('message', async msg => {
        const config = getSettings('appsettings');
        const validChannel = msg.channel.type === 'dm' || msg.channel.id === config.discord.defaultTextChannel;
        if (!validChannel || msg.author.bot) return;

        if (msg.content.match(badWords) && nPercentChance(10)) {
            msg.channel.send(`<@${msg.author.id}>`);
            msg.channel.send({ files: ['https://pa1.narvii.com/6608/cd9477ab5325b13701e0deba56df6ba3fd2ba56a_00.gif'] });
        }
    
        const commandInfo = commandManager.parseMessage(msg.content);
        if (commandInfo) {
            try { await commandManager.executeCommand(commandInfo, msg); } catch (e) { console.error(e); }
        }
    });
    
    botClient.login(getSettings('appsettings').discord.appToken);
}


/**
 * Returns the default channel the bot announces things in.
 * @returns {Discord.TextChannel} The default channel the bot announces things in.
 */
export function getDefaultChannel() {
    const config = getSettings('appsettings');
    return botClient.channels.cache.get(config.discord.defaultTextChannel) as Discord.TextChannel;
}

export function joinVoice() {
    if (!voiceEnabled || voiceConnection) return;
    voice.join().then(connection => voiceConnection = connection).then(() => speak('What\'s up, bitchs?'));
}


export function leaveVoice() {
    if (!voiceConnection) return;
    voiceConnection.disconnect();
    voiceConnection = null;
}

export function speak(message: string) {
    if (!voiceConnection) return;

    const ms = new Date().getTime();
    const fileName = `${ms}.wav`;
    say.export(message, undefined, undefined, fileName, err => {
        if (!voiceConnection) {
            fs.unlinkSync(fileName);
            return;
        }

        const dispatcher = voiceConnection.play(fileName);
        dispatcher.on('close', () => {
            if (fs.existsSync(fileName)) fs.unlinkSync(fileName);
        });

        dispatcher.on('finish', () => {
            if (fs.existsSync(fileName)) fs.unlinkSync(fileName);
        });

        dispatcher.on('error', console.error);

    });
}

export function setVoiceEnabled(enabled: boolean) {
    voiceEnabled = enabled;
    if (voiceEnabled) {
        if (wsClient.isConnected()) {
            (async function () {
                const statusInfo = await wsClient.sendRequest('status');
                if (statusInfo && statusInfo.connectedPlayers.length > 0) joinVoice();
            })();
        }
    } else leaveVoice();
}

export const getVoiceEnabled = () => voiceEnabled;