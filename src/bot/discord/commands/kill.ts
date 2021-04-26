import Discord from 'discord.js';
import * as roles from '../roles';
import * as wsClient from '../../wsClient';

export const name = 'kill';
export const description = 'Shuts down the bot.';
export const role = roles.Admin;
export const active = true;

export async function execute(message: Discord.Message, rest: string) {
    if (wsClient.isConnected()) wsClient.destroy();

    await message.channel.send('bye');
    message.client.destroy();
    process.exit(0);
}