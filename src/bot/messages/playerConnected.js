const config = require('../../config');
const discordBot = require('../discord/bot');
const { getCustomMessages } = require('../../utilities');

module.exports =  {
    /**
     * 
     * @param {string} data 
     */
    execute: function (data) {
        const messages = getCustomMessages(data, 'playerConnected', '{name} has joined {serverName}!');
        discordBot.getDefaultChannel().send(messages.text);
        discordBot.speak(messages.voice);
    }
};