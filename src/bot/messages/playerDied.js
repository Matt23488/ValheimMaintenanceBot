const config = require('../../config');
const discordBot = require('../discord/bot');

module.exports =  {
    /**
     * 
     * @param {string} data 
     */
    execute: function (data) {
        // TODO: tie player names to Discord IDs (maybe). Then I can show the discord names as well, and also pick on people in Discord :)
        const pickOn = config.valheim.pickOnUsers.find(u => u.character === data);
        if (pickOn) discordBot.getDefaultChannel().send(`<@${pickOn.discord}> (_${data}_) died again. <:joy:831246652173844494>`);
        else discordBot.getDefaultChannel().send(`Player _${data}_ has died. F in the chat.`);
    }
};