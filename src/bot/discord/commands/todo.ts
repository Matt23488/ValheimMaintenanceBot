import { BotCommand } from '../../../commonTypes';

const todoList = [
    { name: 'World Stuff', value: 'I want to be able to restore backups of the world, as well as change the world that is hosted. Low priority.' }
];

export const command: BotCommand = {
    name: 'todo',
    description: 'Lists upcoming changes.',
    admin: false,
    active: true,

    execute: (message, rest) => {
        message.channel.send({
            embed: {
                color: 0x9900ff,
                title: 'Upcoming Changes',
                fields: todoList
            }
        });
        return Promise.resolve();
    }
};