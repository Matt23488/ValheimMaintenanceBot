import { BotCommand } from '../../../commonTypes';
import fs from 'fs';
import path from 'path';

export const command: BotCommand = {
    name: 'clip',
    description: 'Saves a url. Intended to save clips from Valheim.',
    admin: false,
    active: true,

    execute: async (message, rest) => {
        const clips = getClips();
        if (rest.length === 0) {
            await message.channel.send({
                embed: {
                    color: 0x0099ff,
                    title: 'Saved Clips',
                    description: 'Here are some good memories. Use `!clip <index>` and I will embed the requested video in the channel.',
                    fields: clips.map((c, i) => ({ name: `index: ${i}`, value: `${c.url}\n${c.name}` }))
                }
            });
            return;
        }

        const firstSpace = rest.indexOf(' ');
        if (firstSpace === -1) {
            const index = parseInt(rest);
            if (isNaN(index) || index < 0 || index >= clips.length) {
                await message.reply(`'${rest}' is not a valid index.`);
                return;
            }

            const clip = clips[index];
            await message.channel.send(clip.url);
            return;
        }

        const url = rest.slice(0, firstSpace).trim();
        const name = rest.slice(firstSpace).trim();

        clips.push({ name, url });
        saveClips(clips);

        await message.reply('your clip has been added.');
    }
};

const getClips = (): Clip[] => {
    if (!fs.existsSync('data/clips.json')) {
        return [];
    }

    const text = fs.readFileSync('data/clips.json').toString();
    return JSON.parse(text);
};

const saveClips = (clips: Clip[]) => fs.writeFileSync('data/clips.json', JSON.stringify(clips));

interface Clip {
    url: string;
    name: string;
}