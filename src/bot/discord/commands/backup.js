const Discord = require('discord.js');
const roles = require('../roles');
const fs = require('fs');
const path = require('path');
const config = require('../../../config');

module.exports = {
    name: 'backup',
    description: 'Backs up the current (or specified world), or lists backups.',
    role: roles.Admin,
    active: true,

    /**
     * 
     * @param {Discord.Message} message
     * @param {string} rest 
     * @returns {Promise<void>}
     */
    execute: function (message, rest) {
        const params = rest.split(' ');
        switch (params[0]) {
            case '':
            case 'l':
            case 'list':
                let worlds = fs.existsSync(config.backupDir) ? fs.readdirSync(config.backupDir) : [config.valheim.world];
                if (params[1]) worlds = worlds.filter(w => w === params[1]);

                message.channel.send({
                    embed: {
                        color: 0x0099ff,
                        title: 'World Backups',
                        fields: worlds.map(w => {
                            const backupDir = path.join(config.backupDir, w);
                            const backups = fs.existsSync(backupDir) ? fs.readdirSync(backupDir) : [];

                            return {
                                name: w,
                                value: backups.length > 0 ? backups.map(b => new Date(Number(b)).toLocaleString()).join('\n') : '_None_',
                                inline: true
                            };
                        })
                    }
                });
                break;
            case 'w':
            case 'world':
                const worldName = params[1] || config.valheim.world;
                if (!fs.existsSync(path.join(process.env['USERPROFILE'], 'AppData/LocalLow/IronGate/Valheim/worlds', `${worldName}.db`))) {
                    message.reply(`I don't see a world named _${worldName}_.`);
                    break;
                }

                if (!fs.existsSync(config.backupDir)) fs.mkdirSync(config.backupDir);
                
                const worldDir = path.join(config.backupDir, worldName);
                if (!fs.existsSync(worldDir)) fs.mkdirSync(worldDir);

                const now = new Date();
                const newDir = path.join(worldDir, now.getTime().toString());
                if (!fs.existsSync(newDir)) fs.mkdirSync(newDir);

                fs.writeFileSync(path.join(newDir, `${worldName}.db`), fs.readFileSync(path.join(process.env['USERPROFILE'], 'AppData/LocalLow/IronGate/Valheim/worlds', `${worldName}.db`)));
                fs.writeFileSync(path.join(newDir, `${worldName}.fwl`), fs.readFileSync(path.join(process.env['USERPROFILE'], 'AppData/LocalLow/IronGate/Valheim/worlds', `${worldName}.fwl`)));
                message.channel.send(`_${worldName}_ backed up ${now.toLocaleString()}.`);
                break;
            default:
                message.reply(`_${params[0]}_ is not a valid argument for \`${config.discord.commandPrefix}backup\`.`);
                break;
        }
        return Promise.resolve();
    }
};