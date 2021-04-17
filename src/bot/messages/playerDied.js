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
                discordBot.getDefaultChannel().send(`<@${user.id}> (_${data}_) died again. <:joy:831246652173844494>`);
                discordBot.speak(`${data} died again lmao`);
            }
            else {
                discordBot.getDefaultChannel().send(`<@${user.id}> (_${data}_) has died. F in the chat.`);
                discordBot.speak(`${data} has died. F.`);
            }
        } else {
            discordBot.getDefaultChannel().send(`_${data}_ has died. F in the chat.`);
            discordBot.speak(`${data} has died. F.`);
        }
    }
};