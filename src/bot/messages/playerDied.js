const discordBot = require('../discord/bot');
const { getCustomMessages } = require('../../utilities');

module.exports =  {
    /**
     * 
     * @param {string} data 
     */
    execute: function (data) {
        const messages = getCustomMessages(data, 'playerDied', '{name} has died. F in the chat.');
        discordBot.getDefaultChannel().send(messages.text);
        discordBot.speak(messages.voice);
    }
};