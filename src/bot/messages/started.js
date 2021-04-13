const config = require('../../config');
const discordBot = require('../discord/bot');

module.exports =  {
    /**
     * 
     * @param {string} data 
     */
    execute: function (data) {
        const channel = discordBot.getClient().channels.cache.get(config.defaultChannel);
        channel.send(`Server started at \`${data}\`.`);
    }
};