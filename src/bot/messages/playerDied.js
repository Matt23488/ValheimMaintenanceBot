const discordBot = require('../discord/bot');
const { getUsers } = require('../../utilities');

module.exports =  {
    /**
     * 
     * @param {string} data 
     */
    execute: function (data) {
        const user = getUsers().find(u => u.characters.indexOf(data) >= 0);
        if (user) {
            if (user.pickOn) discordBot.getDefaultChannel().send(`<@${user.id}> (_${data}_) died again. <:joy:831246652173844494>`);
            else discordBot.getDefaultChannel().send(`<@${user.id}> (_${data}_) has died. F in the chat.`);
        } else {
            discordBot.getDefaultChannel().send(`_${data}_ has died. F in the chat.`);
        }
    }
};