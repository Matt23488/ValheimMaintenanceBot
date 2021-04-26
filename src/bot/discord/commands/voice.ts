import Discord from 'discord.js';
import * as roles from '../roles';
import * as discordBot from '../bot';

export const name = 'voice';
export const description = 'Tells you if the bot will join voice or not, or set if it can or not.';
export const role = roles.Admin;
export const active = true;

export function execute(message: Discord.Message, rest: string) {
    switch (rest.toLocaleLowerCase()) {
        case '':
            message.channel.send(`Voice is currently _${discordBot.getVoiceEnabled() ? 'enabled' : 'disabled'}_.`);
            break;
        case 'e':
        case 'enable':
        case 'enabled':
        case 't':
        case 'true':
            discordBot.setVoiceEnabled(true);
            message.channel.send('Voice enabled successfully.');
            break;
        case 'd':
        case 'disable':
        case 'disabled':
        case 'f':
        case 'false':
            discordBot.setVoiceEnabled(false);
            message.channel.send('Voice disabled successfully.');
            break;
    }
    return Promise.resolve();
}