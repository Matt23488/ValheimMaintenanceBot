import Discord from 'discord.js';

export const name = 'poop';
export const description = 'Have the bot insult you.';
export const role = null;
export const active = false;

export async function execute(message: Discord.Message, rest: string) {
    await message.reply('you\'re 12.');
}