const Discord = require('discord.js');

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
        // TODO: Parse the world file. Tried it once but it was really slow so I manually parsed
        // the values and hardcoded them for now. Obviously this only works for our world.
        const locations = [
            { x:  7814.27685546875,  y: 46.8652153015137, z:  3194.57763671875  },
            { x: -7404.109375,       y: 32.0077476501465, z:  3761.87646484375  },
            { x:  -519.125366210937, y: 71.7126235961914, z: -6257.04931640625  },
            { x: -9708.294921875,    y: 42.8488845825195, z:   643.530090332031 },
            { x: -8846.37109375,     y: 37.3945922851562, z: -3340.88012695313  },
            { x:  -687.266479492188, y: 45.0766296386719, z: -2446.80712890625  },
            { x:  9405.5185546875,   y: 66.6875,          z:   182.668472290039 },
            { x:  7481.71923828125,  y: 31.1889266967773, z: -3257.50952148438  },
            { x: -1744.00402832031,  y: 47.6506233215332, z: -1290.71606445312  },
            { x: -8714.86328125,     y: 40.4701538085937, z:  -270.191589355469 },
        ];
        locations.forEach(l => l.distFromOrigin = Math.sqrt(l.x*l.x+l.z*l.z));
        locations = locations.sort((a, b) => a.distFromOrigin - b.distFromOrigin);

        message.channel.send(new Discord.MessageEmbed()
            .setColor(0x0099ff)
            .setTitle('Haldor Locations')
            .addFields(locations.map(l => { return { name: `Distance from origin: ${l.distFromOrigin.toFixed(3)}`, value: `\`\`\`X: ${l.x.toFixed(3)}\nY: ${l.y.toFixed(3)}\nY: ${l.z.toFixed(3)}\`\`\``, inline: true }; }))
        );
    }
};