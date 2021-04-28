import { BotCommand } from "../../../commonTypes";

export const command: BotCommand = {
    name: 'ping',
    description: 'Have the bot reply "pong" to you. Mainly used to test that the bot is responsive.',
    role: null,
    active: true,

    execute: async (message, rest) => {
        await message.reply('pong');
    }
};