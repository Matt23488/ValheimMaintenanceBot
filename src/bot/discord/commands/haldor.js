const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../../config');

module.exports = {
    name: 'haldor',
    description: 'Tell us where Haldor\'s possible locations are.',
    role: null,

    /**
     * 
     * @param {Discord.Message} message
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: async function (message, rest) {
        const worldBytes = fs.readFileSync(path.join(process.env['USERPROFILE'], 'AppData/LocalLow/IronGate/Valheim/worlds', `${config.valheim.world}.db`));
        const searchBuffer = Buffer.from('56656E646F725F426C61636B466F72657374', 'hex');

        /**
         * @type {{ x: number, y: number, z: number, distFromOrigin: number }}
         */
        const locations = [];
        let index = searchBuffer.length * -1;
        while ((index = worldBytes.indexOf(searchBuffer, index + searchBuffer.length)) >= 0) {
            const x = worldBytes.readFloatLE(index + searchBuffer.length + 0);
            const y = worldBytes.readFloatLE(index + searchBuffer.length + 4);
            const z = worldBytes.readFloatLE(index + searchBuffer.length + 8);
            locations.push({ x, y, z, distFromOrigin: Math.sqrt(x*x+z*z) });
        }
        locations.sort((a, b) => a.distFromOrigin - b.distFromOrigin);

        message.channel.send(new Discord.MessageEmbed()
            .setColor(0x0099ff)
            .setTitle('Haldor Locations')
            .setDescription('Locations are relative to the center of the map.')
            .addFields(locations.map(l => { return { name: `${l.distFromOrigin.toFixed(3)} away`, value: `\`\`\`${Math.abs(l.x).toFixed(3)} ${l.x < 0 ? 'W' : 'E'}\n${Math.abs(l.z).toFixed(3)} ${l.z < 0 ? 'S' : 'N'}\`\`\``, inline: true }; }))
        );
    }
};