import Discord from 'discord.js';
import { getAppSettings } from '../../../config';
import { getUsers, addCharacter } from '../../../utilities';

export const name = 'player';
export const description = `Associate your in-game character to your Discord user, for more personalized messages. If your character's name is _Hamburger_ then you would just type \`${getAppSettings().discord.commandPrefix}player Hamburger\``;
export const role = null;
export const active = true;

export function execute(message: Discord.Message, rest: string) {
    if (rest.length === 0) {
        message.reply('you forgot to tell me your character\'s name.');
        return Promise.resolve();
    }

    const user = getUsers().find(u => u.characters.indexOf(rest) >= 0);
    if (user) {
        message.reply(`that character belongs to <@${user.id}>.`);
        return Promise.resolve();
    }

    addCharacter(message.author.id, rest);
    message.reply('you\'ve been added.');
    return Promise.resolve();
}