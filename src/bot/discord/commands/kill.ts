import * as roles from '../roles';
import * as wsClient from '../../wsClient';
import { BotCommand } from '../../../commonTypes';

export const command: BotCommand = {
    name: 'kill',
    description: 'Shuts down the bot.',
    admin: true,
    active: true,

    execute: async (message, rest) => {
        if (wsClient.isConnected()) wsClient.destroy();

        await message.channel.send('bye');
        message.client.destroy();
        process.exit(0);
    }
};