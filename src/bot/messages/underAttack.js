const Discord = require('discord.js');
const config = require('../../config');
const discordBot = require('../discord/bot');

module.exports =  {
    /**
     * 
     * @param {{ type: string, message: string }} data 
     */
    execute: function (data) {
        const channel = discordBot.getClient().channels.cache.get(config.defaultChannel);

        const embed = new Discord.MessageEmbed()
            .setColor(0xff0000)
            .setTitle('We\'re under attack!')
            .setDescription(data.message);

        switch (data.type) {
            case 'foresttrolls':
                embed.setImage('https://cdn.discordapp.com/attachments/347519580610232320/830267128799821874/troll-hunter-gif-3.gif');
                break;
        }

        channel.send(embed);
    }
};