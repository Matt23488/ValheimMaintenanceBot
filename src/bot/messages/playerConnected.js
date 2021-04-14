const discordBot = require('../discord/bot');

module.exports =  {
    /**
     * 
     * @param {string} data 
     */
    execute: function (data) {
        discordBot.getDefaultChannel().send(`Player _${data}_ has joined the server!`);
    }
};