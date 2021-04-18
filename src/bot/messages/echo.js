const discordBot = require('../discord/bot');

module.exports =  {
    /**
     * 
     * @param {string} data 
     */
    execute: function (data) {
        discordBot.getDefaultChannel().send(data);
        discordBot.speak(data);
    }
};