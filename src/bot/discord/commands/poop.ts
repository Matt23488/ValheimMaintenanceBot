import { BotCommand } from '../../../commonTypes';

export const command: BotCommand = {
    name: 'poop',
    description: 'Have the bot insult you.',
    admin: false,
    active: false,

    execute: async (message, rest) => {
        await message.reply('you\'re 12.');
    }
};