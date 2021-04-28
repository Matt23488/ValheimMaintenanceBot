import Discord from 'discord.js';
import { ClientMessage } from '../../commonTypes';
import { getAppSettings } from '../../config';
import * as discordBot from '../discord/bot';

export const message: ClientMessage<'underAttack'> = {
    execute: data => {
        const channel = discordBot.getDefaultChannel();

        const embed = new Discord.MessageEmbed()
            .setColor(0xff0000)
            .setTitle('We\'re under attack!');

        const config = getAppSettings();
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