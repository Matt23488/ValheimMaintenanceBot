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
            case 'army_moder':
                embed.setImage('https://i.pinimg.com/originals/73/56/55/73565582e9ab3974c9e2d54e063cb9a8.gif');
                break;

            case 'skeletons':
                embed.setImage('https://i.pinimg.com/originals/7f/e2/49/7fe2495ce378b955d79567ce2f5d5fb3.gif');
                break;
            case 'blobs':
                embed.setImage('https://media.tenor.com/images/0f53444a91cea9c75b96e49873853fb8/tenor.gif');
                break;
            case 'foresttrolls':
                embed.setImage('https://cdn.discordapp.com/attachments/347519580610232320/830267128799821874/troll-hunter-gif-3.gif');
                break;
        }

        channel.send(embed);
    }
};