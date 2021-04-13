const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../../config');
const BinaryFile = require('binary-file');

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
        //await message.reply('pong');
        //const world = fs.readFileSync(path.join(config.valheim.worldDirectory, `${config.valheim.world}.db`));
        const world = new BinaryFile(path.join(config.valheim.worldDirectory, `${config.valheim.world}.db`), 'r');
        await world.open();
        const bytes = await world.read(world.size());
        await world.close();

        // 56 65 6E 64 6F 72 5F 42 6C 61 63 6B 46 6F 72 65 73 74
        /**
         * @type {{ x: number, y: number, z: number }[]}
         */
        const locations = [];
        const searchString = 'Vendor_BlackForest';
        while (true) {
            const index = bytes.indexOf(searchString);
            if (index === -1) break;

            locations.push({
                x: bytes.readFloatLE(index + searchString.length + 0),
                y: bytes.readFloatLE(index + searchString.length + 4),
                z: bytes.readFloatLE(index + searchString.length + 8)
            });
        }

        message.channel.send(new Discord.MessageEmbed()
            .setColor(0x0099ff)
            .setTitle('Haldor Locations')
            .addFields(locations.map(l => { return { name: '\u200B', value: `(${l.x}, ${l.y}, ${l.z})`, inline: true }; }))
        );
    }
};