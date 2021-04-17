const Discord = require('discord.js');
const config = require('../../config');
const discordBot = require('../discord/bot');

module.exports =  {
    /**
     * 
     * @param {string} data 
     */
    execute: function (data) {
        const channel = discordBot.getClient().channels.cache.get(config.defaultChannel);

        const embed = new Discord.MessageEmbed()
            .setColor(0xff0000)
            .setTitle('We\'re under attack!');

        const attack = config.valheim.attacks.find(a => a.name === data);
        if (attack) {
            embed.setDescription(attack.message).setImage(attack.image);
            //setTimeout(() => channel.send('The attack is over. Thank gods.'), attack.duration * 1000);
            discordBot.speak(attack.message);
        }
        else {
            embed.setDescription(`Not sure what they are, but the server event is \`${data}\`!`);
            discordBot.speak(`We're under attack by ${data}!`);
        }

        channel.send(embed);
    }
};