import { BotCommand, ClientMessageDynamic } from '../../../commonTypes';
import * as roles from '../roles';

export const command: BotCommand = {
    name: 'trigger',
    description: 'Tests a trigger.',
    admin: true,
    active: true,

    execute: async (message, rest) => {
        const firstSpace = rest.indexOf(' ');
        const triggerType = rest.slice(0, firstSpace);
        const data = JSON.parse(rest.slice(firstSpace + 1).trim());

        message.channel.send(`TESTING TRIGGER \`${triggerType}\``);

        try {
            const trigger = require(`../../messages/${triggerType}`).message as ClientMessageDynamic;
            trigger.execute(data);
        }
        catch (e) {
            message.channel.send('There was a problem testing the trigger.');
        }
    }
};