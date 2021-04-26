import Discord from 'discord.js';
import * as roles from '../roles';

export const name = 'trigger';
export const description = 'Tests a trigger.';
export const role = roles.Admin;
export const active = true;

export async function execute(message: Discord.Message, rest: string) {
    const firstSpace = rest.indexOf(' ');
    const triggerType = rest.slice(0, firstSpace);
    const data = JSON.parse(rest.slice(firstSpace + 1).trim());

    message.channel.send(`TESTING TRIGGER \`${triggerType}\``);

    try {
        const trigger = require(`../../messages/${triggerType}`);
        trigger.execute(data);
    }
    catch (e) {
        message.channel.send('There was a problem testing the trigger.');
    }
}