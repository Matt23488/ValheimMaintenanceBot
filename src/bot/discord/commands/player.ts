import { BotCommand } from '../../../commonTypes';
import { getSettings } from '../../../config';
import { getUsers, addCharacter } from '../../../Users';

export const command: BotCommand = {
    name: 'player',
    description: `Associate your in-game character to your Discord user, for more personalized messages. If your character's name is _Hamburger_ then you would just type \`${getSettings('appsettings').discord.commandPrefix}player Hamburger\``,
    role: null,
    active: true,

    execute: (message, rest) => {
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
};