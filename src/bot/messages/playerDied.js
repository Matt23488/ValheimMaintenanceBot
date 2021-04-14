const discordBot = require('../discord/bot');

module.exports =  {
    /**
     * 
     * @param {string} data 
     */
    execute: function (data) {
        if (config.valheim.pickOnUsers.indexOf(data) >= 0) discordBot.getDefaultChannel().send(`_${data}_ died again. <:joy:831246652173844494>`);
        else discordBot.getDefaultChannel().send(`Player _${data}_ has died. F in the chat.`);
    }
};