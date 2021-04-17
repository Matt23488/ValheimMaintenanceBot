const config = require('../../config');
const discordBot = require('../discord/bot');
const { getUsers, nPercentChance } = require('../../utilities');

module.exports =  {
    /**
     * 
     * @param {string} data 
     */
    execute: function (data) {
        const user = getUsers().find(u => u.characters.indexOf(data) >= 0);
        if (user) {
            if (user.pickOn && nPercentChance(25)) {
                discordBot.getDefaultChannel().send(`<@${user.id}> (_${data}_) has joined ${config.valheim.name} and will soon be needing help... <:joy:831246652173844494>`);
                discordBot.speak(`Uh-oh, ${data} has joined ${config.valheim.name}. They're gonna need help lmao`);
            }
            else {
                discordBot.getDefaultChannel().send(`<@${user.id}> (_${data}_) has entered ${config.valheim.name}!`);
                discordBot.speak(`${data} has joined ${config.valheim.name}!`);
            }
        } else {
            discordBot.getDefaultChannel().send(`_${data}_ has entered ${config.valheim.name}!`);
            discordBot.speak(`${data} has joined ${config.valheim.name}!`);
        }
    }
};