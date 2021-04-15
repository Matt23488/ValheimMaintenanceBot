const discordBot = require('../discord/bot');
const config = require('../../config');
const { getUsers, nPercentChance } = require('../../utilities');

module.exports =  {
    /**
     * 
     * @param {string} data 
     */
    execute: function (data) {
        const user = getUsers().find(u => u.characters.indexOf(data) >= 0);
        if (user) {
            if (user.pickOn && nPercentChance(25)) discordBot.getDefaultChannel().send(`<@${user.id}> (_${data}_) admits defeat and has left ${config.valheim.name}. <:joy:831246652173844494>`);
            else discordBot.getDefaultChannel().send(`<@${user.id}> (_${data}_) has left ${config.valheim.name}.`);
        } else {
            discordBot.getDefaultChannel().send(`_${data}_ has left ${config.valheim.name}.`);
        }
    }
};