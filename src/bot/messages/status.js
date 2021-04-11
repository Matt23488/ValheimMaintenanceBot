// const Discord = require('discord.js');
// const config = require('../../config.js');
// const discordBot = require('../discord/bot.js');

// /**
//  * 
//  * @param {string} str 
//  * @param {number} length 
//  */
//  function repeat(str, length) {
//     let result = '';
//     for (let i = 0; i < length; i++) result += str;
//     return result;
// }

// module.exports =  {
//     /**
//      * 
//      * @param {string} data 
//      */
//     execute: function (data) {
//         /**
//          * @type {{ status: number, statuses: any, name: string, ip: string, connectedPlayers: string[] }}
//          */
//         const statusInfo = JSON.parse(data);
//         const channel = discordBot.getClient().channels.cache.get(config.defaultChannel);

//         if (!statusInfo.isRunning) channel.send('The server is not currently started. Use `!start` to start the server.');
//         else {
//             try {
//                 const title = `${statusInfo.name} Server Status`;
//                 channel.send(new Discord.MessageEmbed()
//                     .setColor('#9900ff')
//                     .setTitle(`\`${title}\``)
//                     .addField(repeat('-', 50), '\u200B')
//                     .addField('Server IP', `\`${statusInfo.ip}\``)
//                     .addField(repeat('-', 50), '\u200B')
//                     .addField(`${statusInfo.connectedPlayers.length} player${statusInfo.connectedPlayers.length === 1 ? '' : 's'} connected`, statusInfo.connectedPlayers.length > 0 ? statusInfo.connectedPlayers.map(p => `_${p}_`).join(', ') : '\u200B')
//                     .setTimestamp()
//                 );
//             } catch (e) { }
//         }
//     }
// };