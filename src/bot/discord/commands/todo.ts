import Discord from 'discord.js';

const todoList = [
    { name: 'Personality', value: 'I want all of my response messages to come from a great Viking warrior.' },
    { name: 'World Stuff', value: 'I want to be able to restore backups of the world, as well as change the world that is hosted. Low priority.' }
];

export const name = 'todo';
export const description = 'Lists upcoming changes.';
export const role = null;
export const active = true;

export function execute(message: Discord.Message, rest: string) {
    message.channel.send({
        embed: {
            color: 0x9900ff,
            title: 'Upcoming Changes',
            fields: todoList
        }
    });
    return Promise.resolve();
}