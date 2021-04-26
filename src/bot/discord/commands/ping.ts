import Discord from 'discord.js';

export const name = 'ping';
export const description = 'Have the bot reply "pong" to you. Mainly used to test that the bot is responsive.';
export const role = null;
export const active = true;

export async function execute(message: Discord.Message, rest: string) {
    await message.reply('pong');
}