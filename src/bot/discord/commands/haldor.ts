import fs from 'fs';
import path from 'path';
import { BotCommand } from '../../../commonTypes';
import { getSettings } from '../../../config';

type Location = { x: number, y: number, z: number, distFromOrigin: number };
export const command: BotCommand = {
    name: 'haldor',
    description: 'Tells you where Haldor is, if he has been found. Otherwise shows the ten possible locations. Once you find him once, he will always appear in that location.',
    role: null,
    active: true,

    execute: (message, rest) => {
        const config = getSettings('appsettings');
        const worldName = rest.length > 0 ? rest : config.valheim.world;
        const worldBytes = fs.readFileSync(path.join(process.env['USERPROFILE']!, 'AppData/LocalLow/IronGate/Valheim/worlds', `${worldName}.db`));
        const searchBuffer = Buffer.from('56656E646F725F426C61636B466F72657374', 'hex');

        const locations: Location[] = [];
        let index = searchBuffer.length * -1;
        while ((index = worldBytes.indexOf(searchBuffer, index + searchBuffer.length)) >= 0) {
            const x = worldBytes.readFloatLE(index + searchBuffer.length + 0);
            const y = worldBytes.readFloatLE(index + searchBuffer.length + 4);
            const z = worldBytes.readFloatLE(index + searchBuffer.length + 8);
            locations.push({ x, y, z, distFromOrigin: Math.sqrt(x*x+z*z) });
        }
        locations.sort((a, b) => a.distFromOrigin - b.distFromOrigin);

        message.channel.send({
            embed: {
                color: 0x0099ff,
                title: `${locations.length > 1 ? 'Possible ' : ''}Haldor Location${locations.length > 1 ? 's' : ''}`,
                description: locations.length > 1 ? 'Haldor has not been found on this world. Locations are relative to the center of the map.' : 'Haldor has been found. Location is relative to the center of the map.',
                fields: locations.map(l => { return { name: `${Math.round(l.distFromOrigin)}m away`, value: `\`\`\`${Math.round(Math.abs(l.x))}m ${l.x < 0 ? 'W' : 'E'}\n${Math.round(Math.abs(l.z))}m ${l.z < 0 ? 'S' : 'N'}\`\`\``, inline: true }; })
            }
        });

        return Promise.resolve();
    }
};