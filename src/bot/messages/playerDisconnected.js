const discordBot = require('../discord/bot');
const config = require('../../config');
const { getCustomMessages } = require('../../utilities');

module.exports =  {
    /**
     * 
     * @param {string} data 
     */
    execute: function (data) {
        const messages = getCustomMessages(data, 'playerDisconnected', { defaultIfNone: '{name} has left {serverName}.' });
        discordBot.getDefaultChannel().send(messages.text);
        discordBot.speak(messages.voice);
    }
};