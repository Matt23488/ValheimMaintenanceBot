const config = require('../../config');
const discordBot = require('../discord/bot');
const { getUsers, getRandomInteger } = require('../../utilities');

module.exports =  {
    /**
     * 
     * @param {string} data 
     */
    execute: function (data) {
        const user = getUsers().find(u => u.characters.indexOf(data) >= 0);
        if (user) {
            if (user.pickOn && getRandomInteger(100) >= 75) discordBot.getDefaultChannel().send(`<@${user.id}> (_${data}_) has joined ${config.valheim.name} and will soon be needing help... <:joy:831246652173844494>`);
            else discordBot.getDefaultChannel().send(`<@${user.id}> (_${data}_) has entered ${config.valheim.name}!`);
        } else {
            discordBot.getDefaultChannel().send(`_${data}_ has entered ${config.valheim.name}!`);
        }
    }
};