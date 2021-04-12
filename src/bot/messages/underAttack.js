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
        
            
        // https://valheim.fandom.com/wiki/Events
        let duration = 0;
        switch (data) {
            // Story Events
            case 'army_eikthyr':
                duration = 90;
                embed.setImage('https://y.yarn.co/a47654f7-120b-439e-913d-5d00646e0721_text.gif')
                     .setDescription('Eikthyr rallies the creatures of the forest! Boars and Necks are attacking!');
                break;
            case 'army_theelder':
                duration = 120;
                embed.setImage('https://media.tenor.com/images/599cdd556b95428a36efaa0e204d3550/tenor.gif')
                     .setDescription('The forest is moving... Greydwarfs, Greydwarf Brutes, and Greydwarf Shamans are attacking!');
                break;
            case 'army_bonemass':
                duration = 150;
                embed.setImage('https://i.pinimg.com/originals/dc/1e/35/dc1e3521bff05bd04d917da1cf69b226.gif')
                     .setDescription('A foul smell from the swamp! Draugar and Skeletons are attacking!');
                break;
            case 'army_moder':
                duration = 150;
                embed.setImage('https://i.pinimg.com/originals/73/56/55/73565582e9ab3974c9e2d54e063cb9a8.gif')
                     .setDescription('A cold wind blows from the mountains! It\'s cold and Drakes are attacking!');
                break;
            case 'army_goblin':
                duration = 120;
                embed.setImage('https://i.pinimg.com/originals/5d/a2/8d/5da28d337f49542e2f45c8367f1deaaf.gif')
                     .setDescription('The horde is attacking! Fulings, Fuling Berserkers, and Fuling Shamans! AHHHHHHHHHHHHHHHHHHH!');
                break;

            // Enemy Events
            case 'skeletons':
                duration = 120;
                embed.setImage('https://i.pinimg.com/originals/7f/e2/49/7fe2495ce378b955d79567ce2f5d5fb3.gif')
                     .setDescription('Skeleton surprise! Skeletons are attacking!');
                break;
            case 'blobs':
                duration = 120;
                embed.setImage('https://media.tenor.com/images/0f53444a91cea9c75b96e49873853fb8/tenor.gif')
                     .setDescription('Blobs are attacking!');
                break;
            case 'foresttrolls':
                duration = 80;
                embed.setImage('https://cdn.discordapp.com/attachments/347519580610232320/830267128799821874/troll-hunter-gif-3.gif')
                     .setDescription('The ground is shaking! Trolls are attacking!');
                break;
            case 'wolves':
                duration = 120;
                embed.setImage('https://i.pinimg.com/originals/b5/3c/70/b53c70c78900a201352876aaa7eaf823.gif')
                     .setDescription('You are being hunted! Wolves are attacking!');
                break;
            case 'surtlings':
                duration = 120;
                embed.setImage('https://media0.giphy.com/media/yr7n0u3qzO9nG/200w.gif?cid=82a1493b2g1sygp2r690zy4yu0qcuadc3v3xgwz2chrv1v5v&rid=200w.gif')
                     .setDescription('There\'s a smell of sulfur in the air! Surtlings are attacking!');
                break;
            default:
                embed.setDescription(`Not sure what they are, but the server event is \`${data}\`!`);
                break;
        }

        channel.send(embed);
        setTimeout(() => channel.send('The attack is over. Thank gods.'), duration * 1000);
    }
};